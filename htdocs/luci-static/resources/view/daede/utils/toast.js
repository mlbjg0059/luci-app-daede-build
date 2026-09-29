import { ref, reactive } from 'vue'

const toasts = ref([])
let idCounter = 0

export function useToast() {
  const add = (message, type = 'info', duration = 3000) => {
    const id = ++idCounter
    const toast = { id, message, type, visible: true }
    toasts.value.push(toast)
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
    return id
  }

  const remove = (id) => {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx > -1) toasts.value.splice(idx, 1)
  }

  const success = (msg, dur) => add(msg, 'success', dur)
  const error = (msg, dur) => add(msg, 'error', dur)
  const warning = (msg, dur) => add(msg, 'warning', dur)
  const info = (msg, dur) => add(msg, 'info', dur)

  return { toasts, add, remove, success, error, warning, info }
}

export const toast = useToast()