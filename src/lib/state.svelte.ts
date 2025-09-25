export const toastState = $state({
  messages: [] as Array<{
    message: string,
    type: 'success' | 'error',
    id: number
  }>,
  nextId: 0
});

export function addToast(message: string, type: 'success' | 'error' = 'success') {
  toastState.messages = [...toastState.messages, {
    message,
    type,
    id: toastState.nextId++
  }];

  // Auto-remove after 3 seconds
  setTimeout(() => {
    removeToast(toastState.nextId - 1);
  }, 3000);
}

export function removeToast(id: number) {
  toastState.messages = toastState.messages.filter(t => t.id !== id);
} 