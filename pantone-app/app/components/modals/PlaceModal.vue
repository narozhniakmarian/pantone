<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box" role="dialog" aria-label="Umiejscowienie Pantonu">        
        <!-- Header (Clean SVG, no emoji) -->
        <div class="modal-header">
          <h2>
            <svg
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
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
            <span>Umiejscowienie Pantonu</span>
          </h2>
          <button class="modal-close-btn" type="button" aria-label="Zamknij" @click="$emit('close')">
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Success alert -->
          <div v-if="successMsg" class="alert alert-success">
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
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>{{ successMsg }}</span>
          </div>

          <form @submit.prevent="handleSubmit" novalidate>
            <!-- Pantone code -->
            <div class="form-group">
              <label for="place-code">Numer Pantone *</label>
              <input
                id="place-code"
                v-model="form.pantoneCode"
                type="text"
                class="form-control"
                :class="{ error: errors.pantoneCode }"
                placeholder="Np. 208 C, 116, 186 C..."
                autocomplete="off"
              />
              <div v-if="previewHex" class="color-preview-pill" style="margin-top: 0.5rem;">
                <ColorSwatch :hex="previewHex" />
              </div>
              <span v-if="errors.pantoneCode" class="error-msg">{{ errors.pantoneCode }}</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <!-- Sample year -->
              <div class="form-group">
                <label for="place-year">Rok próbki *</label>
                <select
                  id="place-year"
                  v-model="form.sampleYear"
                  class="form-control"
                  :class="{ error: errors.sampleYear }"
                >
                  <option value="">— wybierz —</option>
                  <option value="2016">Wzórnik 2016</option>
                  <option value="2019">Wzórnik 2019</option>
                </select>
                <span v-if="errors.sampleYear" class="error-msg">{{ errors.sampleYear }}</span>
              </div>

              <!-- Gross weight -->
              <div class="form-group">
                <label for="place-weight">Waga Brutto (g) *</label>
                <input
                  id="place-weight"
                  v-model="form.grossWeight"
                  type="number"
                  min="0"
                  class="form-control"
                  :class="{ error: errors.grossWeight }"
                  placeholder="Np. 150"
                />
                <span v-if="errors.grossWeight" class="error-msg">{{ errors.grossWeight }}</span>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <!-- Rack number -->
              <div class="form-group">
                <label for="place-rack">Numer regału *</label>
                <input
                  id="place-rack"
                  v-model="form.rackNumber"
                  type="number"
                  min="1"
                  class="form-control"
                  :class="{ error: errors.rackNumber }"
                  placeholder="1"
                />
                <span v-if="errors.rackNumber" class="error-msg">{{ errors.rackNumber }}</span>
              </div>

              <!-- Shelf number -->
              <div class="form-group">
                <label for="place-shelf">Numer półki *</label>
                <input
                  id="place-shelf"
                  v-model="form.shelfNumber"
                  type="number"
                  min="1"
                  class="form-control"
                  :class="{ error: errors.shelfNumber }"
                  placeholder="1"
                />
                <span v-if="errors.shelfNumber" class="error-msg">{{ errors.shelfNumber }}</span>
              </div>
            </div>

            <!-- Notes -->
            <div class="form-group">
              <label for="place-notes">Komentarz</label>
              <textarea
                id="place-notes"
                v-model="form.notes"
                class="form-control"
                rows="2"
                placeholder="Dodatkowe informacje..."
              />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; height: 42px; margin-top: 0.5rem;">        
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
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              <span>Dodaj wzornik</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'       
import { usePantoneStore } from '~/stores/pantone'
import { useToast } from '~/composables/useToast'
import ColorSwatch from '~/components/ColorSwatch.vue'

const emit = defineEmits(['close'])

const store = usePantoneStore()
const toast = useToast()
const DRAFT_KEY = 'pantone_place_draft'

const form = reactive({
  pantoneCode: '',
  sampleYear: '',
  grossWeight: '',
  rackNumber: '',
  shelfNumber: '',
  notes: '',
})

const previewHex = computed(() => {
  return form.pantoneCode ? store.findColor(form.pantoneCode) : null
})

const errors = reactive({
  pantoneCode: '',
  sampleYear: '',
  grossWeight: '',
  rackNumber: '',
  shelfNumber: '',
})

const successMsg = ref('')
let closeTimer = null

onMounted(() => {
  window.addEventListener('keydown', handleEsc)

  // Restore draft
  if (typeof window !== 'undefined') {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY)
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft)
        Object.assign(form, parsed)
      }
    } catch {}
  }
})

watch(
  form,
  (val) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(val))
    } catch {}
  },
  { deep: true }
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
  clearTimeout(closeTimer)
})

const handleEsc = (e) => {
  if (e.key === 'Escape') emit('close')
}

const validate = () => {
  let valid = true
  Object.keys(errors).forEach(k => errors[k] = '')

  if (!form.pantoneCode.trim()) {
    errors.pantoneCode = 'Wymagane.'
    valid = false
  }
  if (!form.sampleYear) {
    errors.sampleYear = 'Wymagane.'
    valid = false
  }
  if (form.grossWeight === '' || isNaN(Number(form.grossWeight))) {
    errors.grossWeight = 'Wymagane.'
    valid = false
  }
  if (!form.rackNumber || isNaN(Number(form.rackNumber))) {
    errors.rackNumber = 'Wymagane.'
    valid = false
  }
  if (!form.shelfNumber || isNaN(Number(form.shelfNumber))) {
    errors.shelfNumber = 'Wymagane.'
    valid = false
  }

  if (!valid) toast.error('Wypełnij poprawnie wymagane pola.')
  return valid
}

const handleSubmit = () => {
  if (!validate()) return

  try {
    const newSample = store.add({ ...form })
    if (typeof window !== 'undefined') localStorage.removeItem(DRAFT_KEY)

    // Reset form
    Object.assign(form, {
      pantoneCode: '',
      sampleYear: '',
      grossWeight: '',
      rackNumber: '',
      shelfNumber: '',
      notes: '',
    })

    successMsg.value = 'Pantone został dodany pomyślnie.'
    toast.success(`Wzornik ${newSample.pantoneCode} został dodany.`)

    clearTimeout(closeTimer)
    closeTimer = setTimeout(() => emit('close'), 800)
  } catch (err) {
    console.error(err)
    toast.error('Wystąpił błąd.')
  }
}
</script>
