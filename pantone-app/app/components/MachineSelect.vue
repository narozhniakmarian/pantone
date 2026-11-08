<template>
  <div class="form-group">
    <label for="machine-select">Wybierz maszynę</label>
    <select
      id="machine-select"
      class="form-control"
      :class="{ error: showError }"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">— wybierz maszynę —</option>
      <option v-for="machine in machines" :key="machine" :value="machine">
        {{ machine }}
      </option>
    </select>
    <span v-if="showError" class="error-msg">Wybierz maszynę.</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  showError: {
    type: Boolean,
    default: false,
  },
})
defineEmits(['update:modelValue'])

const machines = [
  'Heidelberg CD-74',
  'Heidelberg CD-102',
  'Heidelberg SM-102',
  'Heidelberg SX-102',
]
</script>
