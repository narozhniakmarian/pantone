<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <ClientOnly>
      <ToastContainer />
    </ClientOnly>
  </div>
</template>

<script setup>
import { useTheme } from '~/composables/useTheme'
import ToastContainer from '~/components/ToastContainer.vue'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>
