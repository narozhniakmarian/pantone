import { ref } from 'vue'

const toasts = ref([])
let toastCounter = 0

export function useToast() {
  const addToast = (message, type = 'info', duration = 3500) => {
    const id = ++toastCounter
    const toast = { id, message, type }
    toasts.value.push(toast)

    if (duration > 0 && typeof window !== 'undefined') {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    return id
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const success = (message, duration) => addToast(message, 'success', duration)
  const error = (message, duration) => addToast(message, 'error', duration)
  const warning = (message, duration) => addToast(message, 'warning', duration)
  const info = (message, duration) => addToast(message, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
