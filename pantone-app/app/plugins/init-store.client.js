import { usePantoneStore } from '~/stores/pantone'

export default defineNuxtPlugin(() => {
  const store = usePantoneStore()
  store.initStore()
})
