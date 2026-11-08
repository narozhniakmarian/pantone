import { defineStore } from 'pinia'

const STORAGE_KEYS = {
  inventory: 'pantone_inventory',
  history: 'pantone_history',
  theme: 'pantone_theme',
}

function resolveHexFromRef(colorRef, code) {
  if (!code || !Array.isArray(colorRef) || colorRef.length === 0) return null
  const raw = code.trim().toLowerCase()

  let found = colorRef.find((c) => c.pantone && c.pantone.toLowerCase() === raw)
  if (found) return found.hex

  const clean = raw.replace(/\s+/g, ' ')
  found = colorRef.find((c) => c.pantone && c.pantone.toLowerCase() === clean)
  if (found) return found.hex

  const numOnlyMatch = raw.match(/^(\d+)([a-z]*)$/i)
  if (numOnlyMatch) {
    const num = numOnlyMatch[1]
    const suffix = numOnlyMatch[2].toUpperCase()

    if (suffix) {
      found = colorRef.find((c) => c.pantone && c.pantone.toUpperCase() === `${num} ${suffix}`)
      if (found) return found.hex
    }

    found = colorRef.find((c) => c.pantone && c.pantone.toUpperCase() === `${num} C`)
    if (found) return found.hex

    found = colorRef.find((c) => c.pantone && new RegExp(`^${num}\\s+`, 'i').test(c.pantone))
    if (found) return found.hex
  }

  const withoutWordPantone = raw.replace(/^pantone\s+/i, '').trim()
  if (withoutWordPantone !== raw) {
    return resolveHexFromRef(colorRef, withoutWordPantone)
  }

  return null
}

export const usePantoneStore = defineStore('pantone', {
  state: () => ({
    inventory: [],
    colorRef: [],
    history: [],
  }),

  actions: {
    async initStore() {
      if (typeof window === 'undefined') return

      try {
        const res = await fetch('/pantone-colors.json')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            this.colorRef = data
          }
        }
      } catch (e) {
        console.error('Failed to load color reference:', e)
      }

      try {
        const res = await fetch('/api/inventory')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            this.inventory = data
          }
        }
      } catch (e) {
        console.warn('API inventory fetch failed, trying local fallback:', e)
      }

      if (!this.inventory || this.inventory.length === 0) {
        try {
          const stored = localStorage.getItem(STORAGE_KEYS.inventory)
          if (stored) {
            this.inventory = JSON.parse(stored)
          } else {
            const res = await fetch('/pantone-inventory.json')
            if (res.ok) {
              const data = await res.json()
              if (Array.isArray(data)) {
                this.inventory = data
              }
            }
          }
        } catch { }
      }

      let needsSave = false
      if (Array.isArray(this.inventory)) {
        this.inventory.forEach((s) => {
          if (!s.hex) {
            const foundHex = this.findColor(s.pantoneCode)
            if (foundHex) {
              s.hex = foundHex
              needsSave = true
            }
          }
        })
      }
      if (needsSave) {
        this.saveToStorage()
      }

      try {
        const storedHistory = localStorage.getItem(STORAGE_KEYS.history)
        if (storedHistory) {
          this.history = JSON.parse(storedHistory)
        }
      } catch (e) {
        console.error('Failed to load history:', e)
      }
    },

    search(code) {
      if (!code) return []
      const q = code.toLowerCase().trim().replace(/^pantone\s+/i, '')
      const numMatch = q.match(/\d+/)
      const qNum = numMatch ? numMatch[0] : null

      return this.inventory.filter((s) => {
        if (s.status === 'DELETED') return false
        const sCode = (s.pantoneCode || '').toLowerCase().trim()
        if (sCode.includes(q) || q.includes(sCode)) return true
        if (qNum) {
          const sNumMatch = sCode.match(/\d+/)
          if (sNumMatch && sNumMatch[0] === qNum) return true
        }
        return false
      })
    },

    findColor(code) {
      return resolveHexFromRef(this.colorRef, code)
    },

    add(sampleData) {
      const resolvedHex = this.findColor(sampleData.pantoneCode)
      const weightVal = sampleData.grossWeight !== undefined && sampleData.grossWeight !== ''
        ? Number(sampleData.grossWeight)
        : null

      const sample = {
        id: `sample-${Date.now()}`,
        pantoneCode: sampleData.pantoneCode.trim(),
        hex: resolvedHex || null,
        sampleYear: Number(sampleData.sampleYear),
        rackNumber: Number(sampleData.rackNumber),
        shelfNumber: Number(sampleData.shelfNumber),
        grossWeight: weightVal,
        notes: sampleData.notes || null,
        status: 'AVAILABLE',
        machine: null,
        createdAt: new Date().toISOString(),
      }
      this.inventory.push(sample)
      this.logOperation('ADD', sample.id, sample.pantoneCode, null, 'AVAILABLE', null)
      this.saveToStorage()
      return sample
    },

    take(id, machine) {
      const sample = this.inventory.find((s) => s.id === id)
      if (!sample) return
      const prevStatus = sample.status
      sample.status = 'IN_USE'
      sample.machine = machine
      this.logOperation('TAKE', id, sample.pantoneCode, prevStatus, 'IN_USE', machine)
      this.saveToStorage()
    },

    returnSample(id, returnWeight) {
      const sample = this.inventory.find((s) => s.id === id)
      if (!sample) return
      const prevStatus = sample.status
      const prevMachine = sample.machine
      sample.status = 'AVAILABLE'
      sample.machine = null
      if (returnWeight !== undefined && returnWeight !== null && returnWeight !== '') {
        sample.grossWeight = Number(returnWeight)
      }
      this.logOperation('RETURN', id, sample.pantoneCode, prevStatus, 'AVAILABLE', prevMachine)
      this.saveToStorage()
    },

    deleteSample(id) {
      const sample = this.inventory.find((s) => s.id === id)
      if (!sample) return
      const prevStatus = sample.status
      sample.status = 'DELETED'
      this.logOperation('DELETE', id, sample.pantoneCode, prevStatus, 'DELETED', sample.machine)
      this.saveToStorage()
    },

    logOperation(type, sampleId, pantoneCode, prevStatus, newStatus, machine) {
      this.history.unshift({
        id: `log-${Date.now()}`,
        type,
        sampleId,
        pantoneCode,
        prevStatus,
        newStatus,
        machine: machine || null,
        timestamp: new Date().toISOString(),
      })
      if (this.history.length > 500) {
        this.history = this.history.slice(0, 500)
      }
    },

    async saveToStorage() {
      if (typeof window === 'undefined') return

      try {
        localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(this.inventory))
        localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(this.history))
      } catch (e) {
        console.error('Failed to save to localStorage:', e)
      }

      try {
        await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.inventory),
        })
      } catch (e) {
        console.warn('Could not persist inventory to server disk:', e)
      }
    },
  },
})
