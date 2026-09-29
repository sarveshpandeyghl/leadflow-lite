/**
 * Returns a debounced version of `fn` that only fires after `wait` ms
 * have passed without another call. The latest arguments win.
 */
export function debounce(fn, wait = 250) {
  return function debounced(...args) {
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
