<template>
  <div
    class="color-swatch"
    :style="{ backgroundColor: hex || '#888888' }"
    :title="hex || 'Brak danych o kolorze'"
  />
</template>

<script setup>
defineProps({
  hex: {
    type: String,
    default: null,
  },
})
</script>

<style scoped>
.color-swatch {
  width: 53px;   
  height: 40px;  
  border-radius: var(--radius);
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  display: inline-block;
  transition: transform 0.15s ease;
}

[data-theme="dark"] .color-swatch {
  border-color: rgba(255, 255, 255, 0.2);
}
</style>
