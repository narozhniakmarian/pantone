<template>
  <button
    class="theme-toggle"
    type="button"
    :title="isDark ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'"
    :aria-label="isDark ? 'Jasny motyw' : 'Ciemny motyw'"
    @click="toggle"
  >
    <!-- click to switch to light -->
    <svg
      v-if="isDark"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>

    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'

const { toggleTheme, getCurrentTheme } = useTheme()
const isDark = ref(false)

onMounted(() => {
  isDark.value = getCurrentTheme() === 'dark'
})

const toggle = () => {
  toggleTheme()
  isDark.value = !isDark.value
}
</script>

<style scoped>
.theme-toggle {
  width: 38px;
  height: 38px;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.4);
}
</style>
