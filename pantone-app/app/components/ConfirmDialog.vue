<template>
  <Teleport to="body">
    <div class="modal-overlay confirm-overlay" @click.self="$emit('cancel')">
      <div class="confirm-box" role="dialog" :aria-label="title">
        <div class="confirm-header">
          <h3>{{ title }}</h3>
        </div>
        <div class="confirm-body">
          <p class="confirm-message">{{ message }}</p>
          
          <div v-if="warning" class="confirm-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{{ warning }}</span>
          </div>

          <MachineSelect
            v-if="showMachineSelect"
            v-model="selectedMachine"
            :showError="machineError"
          />

          <div v-if="showWeightInput" class="form-group" style="margin-top: 1rem;">
            <label for="return-weight">Aktualna waga Brutto (g) *</label>
            <input
              id="return-weight"
              v-model="weightValue"
              type="number"
              min="0"
              class="form-control"
              :class="{ error: weightError }"
              placeholder="Wpisz wagę brutto..."
            />
            <span v-if="weightError" class="error-msg">Proszę podać wagę.</span>
          </div>
        </div>

        <div class="confirm-footer">
          <button class="btn btn-secondary" type="button" @click="$emit('cancel')">    
            {{ cancelLabel }}
          </button>
          <button
            class="btn"
            type="button"
            :class="isDanger ? 'btn-danger' : 'btn-primary'"
            @click="handleConfirm"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import MachineSelect from '~/components/MachineSelect.vue'

const props = defineProps({
  title: { type: String, default: 'Potwierdzenie' },
  message: { type: String, default: '' },
  warning: { type: String, default: '' },
  showMachineSelect: { type: Boolean, default: false },
  showWeightInput: { type: Boolean, default: false },
  confirmLabel: { type: String, default: 'Potwierdź' },
  cancelLabel: { type: String, default: 'Anuluj' },
  isDanger: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])

const selectedMachine = ref('')
const machineError = ref(false)

const weightValue = ref('')
const weightError = ref(false)

const handleConfirm = () => {
  if (props.showMachineSelect && !selectedMachine.value) {
    machineError.value = true
    return
  }
  if (props.showWeightInput && (weightValue.value === '' || isNaN(Number(weightValue.value)) || Number(weightValue.value) < 0)) {
    weightError.value = true
    return
  }

  if (props.showMachineSelect) {
    emit('confirm', selectedMachine.value)
  } else if (props.showWeightInput) {
    emit('confirm', Number(weightValue.value))
  } else {
    emit('confirm', true)
  }
}
</script>

<style scoped>
.confirm-overlay {
  z-index: 200;
}

.confirm-box {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
  width: 90%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
}

.confirm-header {
  padding: 1.15rem 1.25rem 0.75rem;
  border-bottom: 1px solid var(--border);
}

.confirm-header h3 {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.confirm-body {
  padding: 1.25rem;
}

.confirm-message {
  font-size: 0.875rem;
  color: var(--card-foreground);
  margin-bottom: 0.75rem;
  line-height: 1.45;
}

.confirm-warning {
  font-size: 0.8125rem;
  color: #b45309;
  background: #fffbeb;
  padding: 0.55rem 0.75rem;
  border-radius: var(--radius);
  margin-bottom: 0.75rem;
  border: 1px solid #fde68a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.confirm-warning svg {
  flex-shrink: 0;
  stroke: #b45309;
}

[data-theme="dark"] .confirm-warning {
  color: #fcd34d;
  background: #451a03;
  border-color: #78350f;
}

[data-theme="dark"] .confirm-warning svg {
  stroke: #fcd34d;
}

.confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem 1rem;
  border-top: 1px solid var(--border);
}
</style>
