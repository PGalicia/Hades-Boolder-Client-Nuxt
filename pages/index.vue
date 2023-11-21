<script setup lang="ts">
/**
 * Imports
 */
// Store
import { useBoonStore } from '@/stores/boons'
import { useModalStore } from '@/stores/modal'

// Constants
import { QUERY_PARAM_BOONS } from '@/constants/Settings'

/**
 * Stores
 */
const { selectedBoonsIds } = storeToRefs(useBoonStore())
const { getSelectedBoons, clearSelectedBoonsListIds } = useBoonStore()
const { isModalActive } = storeToRefs(useModalStore())
const { openModal } = useModalStore()

/**
 * Router
 */
const router = useRouter()
const route = useRoute()

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
watch(isModalActive, (newVal) => {
  document.body.classList.toggle('overflow-hidden', newVal)
})

/**
 * Computed
 */
const determineIfNoBoonIsSelected = computed(() => {
  return !isModalActive.value && selectedBoonsIds.value.length > 0
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

    // Clear out query boon param
    const currentQueryParams = {
      ...route.query,
      [QUERY_PARAM_BOONS]: null
    }

    // Push the updated query params
    router.push({ query: currentQueryParams })
  }
}
</script>

<template>
  <div id="app">
    <!-- Header -->
    <HeaderMain />

    <!-- Select/Share build -->
    <div
      v-if="determineIfNoBoonIsSelected"
      class="gap-4 flex flex-col mb-4"
    >
      <ButtonMain button-text="Select A Boon" @click="openModal" />
      <ButtonMain button-text="Share build" @click="onShareBuildClick" />
      <ButtonMain button-text="Clear build" @click="onClearBuildClick" />
    </div>

    <!-- Start selecting boons -->
    <div v-else class="flex justify-center items-center flex-col mt-12">
      <div class="mb-4">
        Plan or share your next crazy build!
      </div>
      <ButtonMain button-text="Select A Boon" @click="openModal" />
    </div>

    <!-- Boon list -->
    <div class="w-fit my-0 mx-auto">
      <BoonList v-for="(god, index) in getSelectedBoons()" :key="index" :boons="god.boons" />
    </div>

    <!-- Modal -->
    <ModalBoonSelect v-show="isModalActive" />
  </div>
</template>
