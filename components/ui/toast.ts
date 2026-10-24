export const TOAST_EVENT = 'mt:toast';

/** Показать короткое уведомление внизу экрана (его рисует Toaster) */
export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));
}
