<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box" role="dialog" aria-label="Wyszukiwarka Pantonu">
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
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span>Wyszukiwarka Pantonu</span>
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
          <!-- Search input -->
          <div class="search-bar">
            <input
              ref="inputRef"
              v-model="query"
              class="form-control"
              type="text"
              placeholder="Wprowadź kod Pantone (np. 208 C, 116)..."
              @keyup.enter="doSearch"
            />
            <button class="btn btn-primary" type="button" @click="doSearch">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span>Szukaj</span>
            </button>
          </div>

          <!-- Results -->
          <div v-if="searched">
            <div v-if="results.length === 0" class="empty-state">
              <p>Nie znaleziono Pantonu w magazynie.</p>
              <div v-if="searchedHex" class="empty-color-preview" style="display: flex; align-items: center; justify-content: center; margin-top: 1rem;">
                <ColorSwatch :hex="searchedHex" />
              </div>
              <p v-else style="margin-top: 0.5rem; font-size: 0.8125rem; color: var(--muted-foreground);">
                Brak danych o kolorze dla tego kodu.
              </p>
            </div>
            <div v-else class="results-list">
              <SampleCard
                v-for="sample in results"
                :key="sample.id"
                :sample="sample"
                :hex="getHex(sample.pantoneCode)"
                @take="openTake"
                @return="openReturn"
                @delete="openDelete"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Take confirm dialog -->
    <ConfirmDialog
      v-if="takeTarget"
      title="Pobranie wzornika"
      :message="`Pobierasz wzornik ${takeTarget.pantoneCode} (${takeTarget.sampleYear}). Wybierz maszynę drukarską.`"
      :showMachineSelect="true"
      confirmLabel="Pobieram"
      @confirm="confirmTake"
      @cancel="takeTarget = null"
    />

    <!-- Return confirm dialog -->
    <ConfirmDialog
      v-if="returnTarget"
      title="Zwrot wzornika"
      :message="`Zwracasz wzornik ${returnTarget.pantoneCode} (${returnTarget.sampleYear}) z maszyny ${returnTarget.machine}.`"
      :showWeightInput="true"
      confirmLabel="Zwracam"
      @confirm="confirmReturn"
      @cancel="returnTarget = null"
    />

    <!-- Delete confirm dialog -->
    <ConfirmDialog
      v-if="deleteTarget"
      title="Usunięcie wzornika"
      message="Czy na pewno chcesz usunąć ten egzemplarz Pantonu?"
      :warning="deleteTarget.status === 'IN_USE' ? `Wzornik jest aktualnie używany na maszynie: ${deleteTarget.machine}` : ''"
      confirmLabel="Usuń"
      :isDanger="true"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </Teleport>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { usePantoneStore } from '~/stores/pantone'
import { useToast } from '~/composables/useToast'
import SampleCard from '~/components/SampleCard.vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import ColorSwatch from '~/components/ColorSwatch.vue'

defineEmits(['close'])

const store = usePantoneStore()
const toast = useToast()
const query = ref('')
const results = ref([])
const searchedHex = ref(null)
const searched = ref(false)
const inputRef = ref(null)
const takeTarget = ref(null)
const returnTarget = ref(null)
const deleteTarget = ref(null)

onMounted(() => {
  nextTick(() => inputRef.value?.focus())
  window.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
})

const handleEsc = (e) => {
  if (e.key === 'Escape') {
    if (takeTarget.value) { takeTarget.value = null; return }
    if (returnTarget.value) { returnTarget.value = null; return }
    if (deleteTarget.value) { deleteTarget.value = null; return }
  }
}

const doSearch = () => {
  if (!query.value.trim()) return
  results.value = store.search(query.value)
  searchedHex.value = store.findColor(query.value)
  searched.value = true
  if (results.value.length === 0) {
    toast.info('Nie znaleziono fizycznego wzornika w magazynie.')
  }
}

const getHex = (code) => store.findColor(code)

const refreshResults = () => {
  if (searched.value) {
    results.value = store.search(query.value)
  }
}

// Take flow
const openTake = (sample) => {
  takeTarget.value = sample
}

const confirmTake = (machine) => {
  if (!machine) return
  const sample = takeTarget.value
  store.take(sample.id, machine)
  toast.success(`Pobrano wzornik ${sample.pantoneCode} na maszynę ${machine}.`)        
  takeTarget.value = null
  refreshResults()
}

// Return flow
const openReturn = (sample) => {
  returnTarget.value = sample
}

const confirmReturn = (weight) => {
  const sample = returnTarget.value
  store.returnSample(sample.id, weight)
  toast.success(`Zwrócono wzornik ${sample.pantoneCode} do magazynu.`)
  returnTarget.value = null
  refreshResults()
}

// Delete flow
const openDelete = (sample) => {
  deleteTarget.value = sample
}

const confirmDelete = () => {
  if (!deleteTarget.value) return
  const sample = deleteTarget.value
  store.deleteSample(sample.id)
  toast.success(`Wzornik ${sample.pantoneCode} został pomyślnie usunięty.`)
  deleteTarget.value = null
  refreshResults()
}
</script>
