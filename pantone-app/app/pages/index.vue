<template>
  <div>
    <HeroSection
      @open-search="searchOpen = true"
      @open-place="placeOpen = true"
      @open-inventory="inventoryOpen = true"
      @openSearch="searchOpen = true"
      @openPlace="placeOpen = true"
      @openInventory="inventoryOpen = true"
    />

    <SearchModal
      v-if="searchOpen"
      @close="searchOpen = false"
    />

    <PlaceModal
      v-if="placeOpen"
      @close="placeOpen = false"
    />

    <InventoryModal
      v-if="inventoryOpen"
      @close="inventoryOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import HeroSection from '~/components/HeroSection.vue'
import SearchModal from '~/components/modals/SearchModal.vue'
import PlaceModal from '~/components/modals/PlaceModal.vue'
import InventoryModal from '~/components/modals/InventoryModal.vue'

const searchOpen = ref(false)
const placeOpen = ref(false)
const inventoryOpen = ref(false)

const handleEsc = (e) => {
  if (e.key === 'Escape') {
    if (searchOpen.value) { searchOpen.value = false; return }
    if (placeOpen.value) { placeOpen.value = false; return }
    if (inventoryOpen.value) { inventoryOpen.value = false; return }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
})

useSeoMeta({
  title: 'Pantone — System zarządzania wzornikami',
  description: 'System zarządzania fizycznymi wzornikami Pantone dla drukarni.',       
})
</script>
