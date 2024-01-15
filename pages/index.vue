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
import type { BoonType } from '@/types/BoonType'
import type { WeaponType } from '@/types/WeaponType'

/**
 * Stores
 */
const { selectedBoonsIds, selectedWeaponId, slots } = storeToRefs(useBoonStore())
const {
  clearSelectedBoonsListIds,
  clearSelectedWeaponId,
  getSelectedWeapon,
  getSelectedBoonInSpecifiedSlot,
  getSelectedBoons
} = useBoonStore()
const { isModalBuildActive, isModalDeleteActive, selectedBuild } = storeToRefs(useModalStore())
const { openModalBuild, openModalDelete, closeModalDelete, updateInitiallySelectedTypeToWeapon } = useModalStore()

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

function handleWeaponPlaceholderClick () {
  // Update type
  updateInitiallySelectedTypeToWeapon()

  // Open modal
  openModalBuild()
}

function handleBuildCardClick (build: BoonType | WeaponType) {
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
    <!-- @TODO: This might be better as its own component -->
    <div class="flex flex-col h-max gap-8 mb-8">
      <!-- Key Slots -->
      <div class="p-6 bg-gray-200 sm:rounded-lg flex flex-col gap-4">
        <div class="text-2xl font-bold">
          Key Slots
        </div>

        <!-- Slots -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Weapon -->
          <div>
            <BuildCard
              v-if="getSelectedWeapon()"
              :build="getSelectedWeapon()!"
              @click="handleBuildCardClick(getSelectedWeapon()!)"
            />
            <BuildCardPlaceholder
              v-else
              text="weapon"
              @click="handleWeaponPlaceholderClick"
            />
          </div>
          <!-- Slots -->
          <div
            v-for="slot in slots"
            :key="slot.id"
          >
            <BuildCard
              v-if="getSelectedBoonInSpecifiedSlot(slot.id)"
              :build="getSelectedBoonInSpecifiedSlot(slot.id)!"
              @click="handleBuildCardClick(getSelectedBoonInSpecifiedSlot(slot.id)!)"
            />
            <BuildCardPlaceholder
              v-else
              :text="slot.slot"
              @click="openModalBuild"
            />
          </div>
        </div>
      </div>

      <!-- Other Boons -->
      <div>
        <div class="p-6 bg-gray-200 sm:rounded-lg flex flex-col gap-4">
          <div class="text-2xl font-bold">
            Boons
          </div>

          <div class="flex flex-col gap-6">
            <BuildCardPlaceholder
              v-if="getSelectedBoons().length === 0"
              text="boon"
              @click="openModalBuild"
            />
            <BoonList
              v-for="(god, index) in getSelectedBoons()"
              :key="index"
              :boons="god.boons"
            />
          </div>
        </div>
      </div>
    </div>

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
