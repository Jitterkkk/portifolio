export const PRELOADER_DONE_EVENT = "preloader:done";

export function dispatchPreloaderDone() {
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
}

export function onPreloaderDone(callback: () => void) {
  window.addEventListener(PRELOADER_DONE_EVENT, callback);
  return () => window.removeEventListener(PRELOADER_DONE_EVENT, callback);
}
