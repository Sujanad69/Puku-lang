
export const triggerHaptic = (type: 'light'|'medium'|'heavy'|'success'|'error') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    if (type === 'light') navigator.vibrate(10);
    else if (type === 'medium') navigator.vibrate(20);
    else if (type === 'heavy') navigator.vibrate(30);
    else if (type === 'success') navigator.vibrate([10, 30, 20]);
    else if (type === 'error') navigator.vibrate([30, 40, 30]);
  }
};
