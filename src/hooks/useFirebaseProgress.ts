import { useState, useEffect, useRef } from 'react';
import { UserProgress } from '../types';
import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
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
          console.error("Failed to sync to Firebase", err);
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
            // Merge with some defaults in case fields are missing
            const merged = { ...INITIAL_PROGRESS, ...fbData };
            setProgressState(merged);
            saveUserProgress(merged);
          } else {
            // First time login, save local progress to Firebase
            await setDoc(docRef, progress);
          }
          
          // Setup real-time listener for multi-device sync
          onSnapshot(docRef, (snapshot) => {
             if (snapshot.exists() && !snapshot.metadata.hasPendingWrites) {
                // Ignore local writes returning
                isInitialLoad.current = true; // prevent the next render from writing back
                setProgressState(snapshot.data() as UserProgress);
                setTimeout(() => { isInitialLoad.current = false; }, 500);
             }
          });
          
        } catch (error) {
           console.error("Error loading user data:", error);
        } finally {
          setTimeout(() => { isInitialLoad.current = false; }, 500);
          setLoading(false);
        }
      } else {
        // Not logged in, use local
        setProgressState(loadUserProgress());
        isInitialLoad.current = false;
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProgressState(INITIAL_PROGRESS);
    saveUserProgress(INITIAL_PROGRESS);
  };

  return { progress, setProgress, user, loading, login, logout };
}
