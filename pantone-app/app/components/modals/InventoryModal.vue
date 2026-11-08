<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="emit('close')">
      <section class="modal-box inventory-modal" role="dialog" aria-label="Wykaz Pantone">
        <header class="modal-header">
          <h2>Wykaz Pantone <span class="inventory-count">{{ rows.length }} pozycji</span></h2>
          <button class="modal-close-btn" type="button" aria-label="Zamknij" @click="emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>
        <div class="modal-body inventory-body">
          <div v-if="rows.length" class="table-scroll">
            <table>
              <thead><tr><th>Numer</th><th>Rok wzornika</th><th>Kolor</th><th>Rozmieszczenie</th></tr></thead>
              <tbody>
                <tr v-for="row in rows" :key="row.key">
                  <td><strong>{{ row.pantoneCode }}</strong><span v-if="row.lowStock" class="badge badge-low-stock">Resztka</span></td>
                  <td><ul class="sample-entries"><li v-for="entry in row.entries" :key="entry.id">{{ entry.sampleYear ? `Wzórnik ${entry.sampleYear}` : '—' }}</li></ul></td>
                  <td><ColorSwatch :hex="row.hex || store.findColor(row.pantoneCode)" /></td>
                  <td><ul class="sample-entries"><li v-for="entry in row.entries" :key="entry.id">{{ entry.location || '—' }}</li></ul></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="empty-state">Brak wzornikow Pantone w magazynie.</p>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { usePantoneStore } from '~/stores/pantone'
import ColorSwatch from '~/components/ColorSwatch.vue'

const emit = defineEmits(['close'])
const store = usePantoneStore()
const rows = computed(() => {
  const grouped = new Map()
  store.inventory.filter(sample => sample.status !== 'DELETED').forEach(sample => {
    const normalizedCode = (sample.pantoneCode || '').trim().toLowerCase().replace(/\s+/g, ' ')
    const key = normalizedCode
    if (!grouped.has(key)) grouped.set(key, { key, pantoneCode: sample.pantoneCode, hex: sample.hex, entries: [], lowStock: false })
    const row = grouped.get(key)
    const locations = [
      sample.rackNumber && sample.shelfNumber ? `Regal ${sample.rackNumber}, polka ${sample.shelfNumber}` : null,
      sample.machine ? `Maszyna ${sample.machine}` : null,
    ].filter(Boolean)
    row.entries.push({ id: sample.id, sampleYear: sample.sampleYear, location: locations.join(' / ') })
    if (sample.grossWeight !== null && sample.grossWeight !== undefined && Number(sample.grossWeight) < 120) row.lowStock = true
  })
  return [...grouped.values()]
})
const handleEsc = event => { if (event.key === 'Escape') emit('close') }
onMounted(() => window.addEventListener('keydown', handleEsc))
onBeforeUnmount(() => window.removeEventListener('keydown', handleEsc))
</script>

<style scoped>
.inventory-modal { width: min(94vw, 900px); max-height: 88vh; }
.inventory-count { margin-left: .5rem; color: var(--muted-foreground); font-size: .8rem; font-weight: 500; }
.inventory-body { overflow: auto; }
.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; text-align: left; }
th, td { padding: .8rem .75rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
th { position: sticky; top: 0; background: var(--card); color: var(--muted-foreground); font-size: .75rem; text-transform: uppercase; letter-spacing: .04em; }
td:first-child { white-space: nowrap; }
.badge { margin-left: .5rem; }
.sample-entries { display: grid; gap: .35rem; margin: 0; padding: 0; list-style: none; }
.sample-entries li { min-height: 1.4rem; display: flex; align-items: center; }
@media (max-width: 600px) { th, td { padding: .65rem .5rem; } }
</style>
