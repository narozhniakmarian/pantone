<template>
  <div class="sample-card">
    <div class="sample-card__header">
      <div class="sample-card__title">
        <span class="sample-card__code">{{ sample.pantoneCode }}</span>
        <span v-if="sample.sampleYear" class="sample-card__year">Wzórnik {{ sample.sampleYear }}</span>
        <span :class="statusBadgeClass" class="badge">
          <span class="badge-dot" />
          {{ statusLabel }}
        </span>
        <span v-if="isLowStock" class="badge badge-low-stock">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          Końcówka
        </span>
      </div>
      <ColorSwatch :hex="displayHex" />
    </div>

    <div class="sample-card__body">
      <div class="sample-card__meta">
        <div class="meta-item">
          <span class="meta-label">Regał</span>
          <span class="meta-value">{{ sample.rackNumber }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Półka</span>
          <span class="meta-value">{{ sample.shelfNumber }}</span>
        </div>
        <div v-if="sample.grossWeight !== undefined && sample.grossWeight !== null" class="meta-item">
          <span class="meta-label">Waga Brutto</span>
          <span class="meta-value" :class="{ 'text-danger': isLowStock }">
            {{ sample.grossWeight }} g
          </span>
        </div>
        <div v-if="sample.machine" class="meta-item meta-item--machine">
          <span class="meta-label">Maszyna</span>
          <span class="meta-value machine-name">{{ sample.machine }}</span>
        </div>
      </div>

      <p v-if="!displayHex" class="no-color-info">
        Brak danych o kolorze dla tego kodu.
      </p>

      <p v-if="sample.notes" class="sample-notes">
        {{ sample.notes }}
      </p>
    </div>

    <div v-if="showActions" class="sample-card__actions">
      <button
        v-if="!onlyDelete && sample.status === 'AVAILABLE'"
        class="btn btn-primary btn-sm"
        type="button"
        @click="$emit('take', sample)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 17V3" />
          <path d="m6 11 6 6 6-6" />
          <path d="M19 21H5" />
        </svg>
        <span>Pobieram</span>
      </button>

      <button
        v-if="!onlyDelete && sample.status === 'IN_USE'"
        class="btn btn-secondary btn-sm"
        type="button"
        @click="$emit('return', sample)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        <span>Zwracam</span>
      </button>

      <button
        v-if="!onlyDelete || sample.status === 'IN_USE'"
        class="btn btn-danger btn-sm"
        type="button"
        @click="$emit('delete', sample)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
        <span>Usuń</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ColorSwatch from '~/components/ColorSwatch.vue'

const props = defineProps({
  sample: {
    type: Object,
    required: true,
  },
  hex: {
    type: String,
    default: null,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  onlyDelete: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['take', 'return', 'delete'])

const displayHex = computed(() => props.sample.hex || props.hex || null)

const statusLabel = computed(() => {
  switch (props.sample.status) {
    case 'AVAILABLE': return 'Dostępny'
    case 'IN_USE': return 'W użyciu'
    case 'DELETED': return 'Usunięty'
    default: return props.sample.status
  }
})

const statusBadgeClass = computed(() => {
  switch (props.sample.status) {
    case 'AVAILABLE': return 'badge-available'
    case 'IN_USE': return 'badge-in-use'
    case 'DELETED': return 'badge-deleted'
    default: return ''
  }
})

const isLowStock = computed(() => {
  return props.sample.grossWeight !== undefined && 
         props.sample.grossWeight !== null && 
         props.sample.grossWeight < 120
})
</script>

<style scoped>
.sample-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.15rem 1.25rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.15s ease;
}

.sample-card:hover {
  border-color: rgba(128, 29, 66, 0.3);
  box-shadow: var(--shadow-md);
}

.sample-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.sample-card__title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.sample-card__code {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--foreground);
  letter-spacing: -0.01em;
}

.sample-card__year {
  margin-left: 0.25rem;
  background: var(--secondary);
  color: var(--secondary-foreground);
  border: 1px solid var(--border);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
}

.badge-low-stock {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

[data-theme="dark"] .badge-low-stock {
  background: #450a0a;
  color: #fca5a5;
  border-color: #7f1d1d;
}

.text-danger {
  color: var(--destructive) !important;
}

.sample-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.sample-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.meta-label {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.meta-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--foreground);
}

.machine-name {
  color: var(--primary);
}

.no-color-info {
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  font-style: italic;
}

.sample-notes {
  font-size: 0.8125rem;
  color: var(--foreground);
  background: var(--secondary);
  padding: 0.45rem 0.65rem;
  border-radius: var(--radius);
  border-left: 3px solid var(--primary);
  line-height: 1.4;
}

.sample-card__actions {
  margin-top: 0.85rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
