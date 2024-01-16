<script setup lang="ts">
/**
 * Imports
 */
// Constants
import { BUY_ME_A_COFFEE_LINK } from '@/constants/BuyMeACoffee'

// Store
import { useBoonStore } from '@/stores/boons'
import { useModalStore } from '@/stores/modal'

// Types
import type { BuildType } from '@/types/BuildType'

/**
 * Stores
 */
const { selectedBoonsIds, selectedWeaponId } = storeToRefs(useBoonStore())
const {
  clearSelectedBoonsListIds,
  clearSelectedWeaponId
} = useBoonStore()
const { isModalBuildActive, isModalDeleteActive, selectedBuild } = storeToRefs(useModalStore())
const { openModalBuild, openModalDelete, closeModalDelete } = useModalStore()

/**
 * Router
 */
const router = useRouter()

/**
 * Setup
 */
definePageMeta({
  middleware: [
    'preload-selected-boons'
  ]
})

/**
 * Watchers
 */
watch(
  () => isModalDeleteActive.value || isModalBuildActive.value,
  (newVal) => {
    document.body.classList.toggle('overflow-hidden', newVal)
  }
)

/**
 * Computed
 */
const determineIfABoonOrWeaponIsOnTheBoard = computed(() => {
  return selectedBoonsIds.value.length > 0 || selectedWeaponId.value >= 0
})

/**
 * Event handlers
 */
function onShareBuildClick () {
  navigator.clipboard.writeText(window.location.href)
    .then(() => {
      // Let the user know that they copied their build
      alert('Build link copied to clipboard')
    })
}

function onClearBuildClick () {
  // Confirm with users if they want to clear their build or not
  if (confirm('Are you sure you want to clear your build?')) {
    // Remove build in store
    clearSelectedBoonsListIds()
    clearSelectedWeaponId()

    // Clear out boon and weapon param in the query
    router.push({ query: {} })
  }
}

function handleBuildCardClick (build: BuildType) {
  selectedBuild.value = build

  openModalDelete()
}

function handleModalDeleteClosing () {
  selectedBuild.value = null

  closeModalDelete()
}

useHead({
  title: 'Boon Builder',
  meta: [
    { name: 'description', content: 'A web application that allows you to share your builds for Supergiant\'s game: Hades.' }
  ]
})
</script>

<template>
  <div id="app">
    <!-- Header -->
    <HeaderMain />

    <!-- Controls -->
    <!-- @TODO: This might be better as its own component -->
    <div class="p-6 bg-gray-200 sm:rounded-lg mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
      <template v-if="determineIfABoonOrWeaponIsOnTheBoard">
        <div class="font-bold text-lg">
          Controls:
        </div>
        <ButtonMain button-text="Select a Boon" @click="openModalBuild" />
        <ButtonMain button-text="Share" @click="onShareBuildClick" />
        <ButtonMain button-text="Clear" @click="onClearBuildClick" />
      </template>
      <template v-else>
        <div class="font-bold text-lg">
          Plan or share your next crazy build!
        </div>
        <ButtonMain button-text="Select A Boon" @click="openModalBuild" />
      </template>
    </div>

    <!-- Build List -->
    <BuildList @build-click="handleBuildCardClick" />

    <!-- Footer -->
    <div class="text-center p-4 text-gray-500">
      @{{ new Date().getFullYear() }} Patrick Galicia &bull; <a class="underline transition-all hover:underline-offset-4" :href="BUY_ME_A_COFFEE_LINK" target="_blank">Buy Me A Coffee</a>
    </div>

    <!-- Modals -->
    <ModalSelect v-if="isModalBuildActive" />
    <ModalDelete
      v-if="selectedBuild"
      :build="selectedBuild"
      @close-modal="handleModalDeleteClosing"
    />
  </div>
</template>
