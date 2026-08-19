import { useState, useEffect, useRef } from 'react';
import { UserProgress } from '../types';
import { auth, db, googleProvider } from '../lib/firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged, 
  setPersistence,
  inMemoryPersistence,
  browserLocalPersistence,
  User 
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { loadUserProgress, saveUserProgress, INITIAL_PROGRESS } from '../utils/storage';

export function useFirebaseProgress() {
  const [progress, setProgressState] = useState<UserProgress>(() => loadUserProgress());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Track if we just loaded from Firebase to prevent immediate overwrite
  const isInitialLoad = useRef(true);

  // Sync to local state and either local storage or firebase
  const setProgress = (newProgress: UserProgress | ((prev: UserProgress) => UserProgress)) => {
    setProgressState((prev) => {
      const nextProgress = typeof newProgress === 'function' ? newProgress(prev) : newProgress;
      
      // Save locally
      saveUserProgress(nextProgress);
      
      // Save to Firebase if logged in and not first load
      if (user && !isInitialLoad.current) {
        setDoc(doc(db, 'users', user.uid), nextProgress, { merge: true }).catch(err => {
          console.warn("Could not sync to Firebase:", err);
        });
      }
      
      return nextProgress;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          isInitialLoad.current = true;
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const fbData = docSnap.data() as UserProgress;
            // Merge with defaults in case fields are missing
            const merged = { ...INITIAL_PROGRESS, ...fbData };
            setProgressState(merged);
            saveUserProgress(merged);
          } else {
            // First time login, save current progress to Firebase
            await setDoc(docRef, progress, { merge: true });
          }
          
          // Setup real-time listener for multi-device sync
          try {
            onSnapshot(docRef, (snapshot) => {
              if (snapshot.exists() && !snapshot.metadata.hasPendingWrites) {
                isInitialLoad.current = true;
                setProgressState(snapshot.data() as UserProgress);
                setTimeout(() => { isInitialLoad.current = false; }, 500);
              }
            }, (err) => {
              console.warn("Firestore snapshot listener error:", err);
            });
          } catch (e) {
            console.warn("Could not attach snapshot listener", e);
          }
          
        } catch (error) {
          console.warn("Error loading user data from Firestore:", error);
        } finally {
          setTimeout(() => { isInitialLoad.current = false; }, 500);
          setLoading(false);
        }
      } else {
        // Not logged in, use local storage
        setProgressState(loadUserProgress());
        isInitialLoad.current = false;
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Auth Methods
  const loginWithGoogle = async () => {
    try {
      // Ensure persistence is active before popup
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch {
        try {
          await setPersistence(auth, inMemoryPersistence);
        } catch {}
      }

      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.warn("Google login warning:", error);
      
      // If error is related to IndexedDB closing in iframe, retry once with in-memory persistence
      if (error?.message?.includes('Database is closing') || error?.code === 'auth/internal-error') {
        try {
          await setPersistence(auth, inMemoryPersistence);
          const retryResult = await signInWithPopup(auth, googleProvider);
          return { success: true, user: retryResult.user };
        } catch (retryErr: any) {
          console.warn("Google login retry warning:", retryErr);
        }
      }

      let errorMsg = "Google Sign-In was cancelled or unavailable in this window.";
      if (error?.code === 'auth/popup-closed-by-user') {
        errorMsg = "Sign-in popup was closed. Please try again or use Email login.";
      } else if (error?.code === 'auth/popup-blocked') {
        errorMsg = "Popup was blocked by the browser. Please allow popups or use Email login.";
      } else if (error?.code === 'auth/cancelled-popup-request') {
        errorMsg = "Only one sign-in request can be processed at a time.";
      } else if (error?.message?.includes('Database is closing')) {
        errorMsg = "Session was interrupted. Please try again or create an account with Email & Password!";
      }

      return { success: false, error: errorMsg };
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch {
        try {
          await setPersistence(auth, inMemoryPersistence);
        } catch {}
      }

      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.warn("Email login warning:", error);
      let msg = "Failed to sign in. Please check your email and password.";
      if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password' || 
        error.code === 'auth/invalid-credential'
      ) {
        msg = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        msg = "Invalid email address format.";
      } else if (error.code === 'auth/too-many-requests') {
        msg = "Too many failed attempts. Please try again later or reset password.";
      }
      return { success: false, error: msg };
    }
  };

  const signupWithEmail = async (email: string, pass: string, displayName?: string) => {
    try {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch {
        try {
          await setPersistence(auth, inMemoryPersistence);
        } catch {}
      }

      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }
      return { success: true, user: result.user };
    } catch (error: any) {
      console.warn("Email signup warning:", error);
      let msg = "Failed to create account. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        msg = "This email is already registered. Try signing in instead.";
      } else if (error.code === 'auth/weak-password') {
        msg = "Password should be at least 6 characters long.";
      } else if (error.code === 'auth/invalid-email') {
        msg = "Please enter a valid email address.";
      }
      return { success: false, error: msg };
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (error: any) {
      console.warn("Password reset warning:", error);
      let msg = "Could not send password reset email.";
      if (error.code === 'auth/user-not-found') {
        msg = "No account found with this email address.";
      } else if (error.code === 'auth/invalid-email') {
        msg = "Please enter a valid email address.";
      }
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out error", e);
    }
    setProgressState(INITIAL_PROGRESS);
    saveUserProgress(INITIAL_PROGRESS);
  };

  // Backwards compatibility alias
  const login = loginWithGoogle;

  return { 
    progress, 
    setProgress, 
    user, 
    loading, 
    login, 
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    sendPasswordReset,
    logout 
  };
}
