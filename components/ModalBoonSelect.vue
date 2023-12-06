<script setup lang="ts">
/**
 * Imports
 */
// Store
import { useBoonStore } from '@/stores/boons'
import { useModalStore } from '@/stores/modal'

// Types
import type { GodType } from '@/types/GodType'
import type { BoonType } from '@/types/BoonType'

// Constants
import { QUERY_PARAM_BOONS } from '@/constants/Settings'

/**
 * Store
 */
const { selectedBoonsIds, gods } = storeToRefs(useBoonStore())
const { addToSelectedBoons, getUnselectedBoons, doesBoonMeetPreqs } = useBoonStore()
const { closeModal } = useModalStore()

/**
 * Refs
 */
const selectedGod = ref('zeus')
const selectedBoon = ref<BoonType | null>(null)

/**
 * Router
 */
const router = useRouter()
const route = useRoute()

/**
 * Event handlers
 */
function handleGodFilter (god: GodType) {
  // Update the selected god
  selectedGod.value = god.god

  // Empty out selectedBoon
  selectedBoon.value = null
}

function handleBoonSelection (chosenBoon: BoonType) {
  // If chosenBoon doesn't meet the requirement then prevent click from happening
  if (!doesBoonMeetPreqs(chosenBoon)) {
    return
  }

  // Update the selected boon
  selectedBoon.value = chosenBoon
}

function handleBoonAddition () {
  // If there's no selectedBoon, return
  if (!selectedBoon.value) {
    return
  }

  // Add to selectedBoonsIds list in Vuex
  addToSelectedBoons(selectedBoon.value.id)

  // Get current query params and add update selected boons
  const currentQueryParams = {
    ...route.query,
    [QUERY_PARAM_BOONS]: encodeURIComponent(JSON.stringify(selectedBoonsIds.value))
  }

  // Push the updated query params
  router.push({ query: currentQueryParams })

  // Reset boon selection
  selectedGod.value = 'zeus'
  selectedBoon.value = null

  // Close modal
  closeModal()
}
</script>

<template>
  <div
    class="c-modal-boon w-screen h-screen fixed top-0 left-0 z-50 bg-black/25"
    @click.self="closeModal"
  >
    <div class="c-modal-boon__main rounded-lg w-full bg-white overflow-x-hidden mx-auto my-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hide-scrollbar">
      <div
        class="absolute top-2 right-2 bg-black/50 rounded-full w-8 h-8 flex justify-center items-center cursor-pointer"
        @click="closeModal"
      >
        &#10006;
      </div>
      <div class="pt-10 pr-6 pb-2 pl-6 font-bold text-3xl">
        Select A Boon
      </div>

      <div class="py-4 px-6 flex flex-wrap">
        <div
          v-for="god in gods"
          :key="god.id"
          class="c-modal-boon__god border-2 border-solid hover:border-primary mr-2 mb-2 py-1 px-2 cursor-pointer rounded w-fit font-bold text-base"
          :class="{
            'border-black': god.god !== selectedGod,
            ['border-primary bg-primary text-white']: god.god === selectedGod
          }"
          @click="handleGodFilter(god)"
        >
          {{ god.god }}
        </div>
      </div>

      <div class="c-modal-boon__list w-fit my-8 mx-auto md:py-0 px-8">
        <div
          v-for="(boon, index) in getUnselectedBoons(selectedGod)"
          :key="index"
          class="c-modal-boon__boon w-fit cursor-pointer relative"
          :class="{
            'c-modal-boon__boon--disabled': !doesBoonMeetPreqs(boon),
            'c-modal-boon__boon--chosen': selectedBoon && selectedBoon.id === boon.id
          }"
          @click="handleBoonSelection(boon); handleBoonAddition()"
        >
          <BoonCard :boon="boon" />
        </div>
      </div>
      <!-- <div class="py-8 px-4 flex justify-center bg-white w-full box-border sticky bottom-0 left-0 z-50 shadow-inner">
        <ButtonMain
          button-text="Add Boon"
          :is-button-disabled="!selectedBoon"
          @click="handleBoonAddition"
        />
      </div> -->
    </div>
  </div>
</template>

<style lang="scss">
.c-modal-boon {
  @media (max-width: 500px) {
    .c-modal-boon__main {
      position: fixed;
      height: 100%;
      top: 0;
      left: 0;
      bottom: 0;
      transform: none;
      border-radius: 0;
    }

    .c-modal-boon__boon { width: 100%; }
  }

  // c-modal-boon__main
  &__main {
    height: 90%;
    max-height: 950px;
    max-width: 550px;
  }

  // c-modal-boon__boon
  &__boon { margin: 0 auto 1.5rem; }

  &__boon--chosen::before,
  &__boon:not(.c-modal-boon__boon--disabled):hover::before,
  &__boon--disabled::before {
    position: absolute;
    content: '';
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    border-radius: 10px;
  }

  // c-modal-boon__boon--chosen
  &__boon--chosen::before,
  &__boon:not(.c-modal-boon__boon--disabled):hover::before {
    background-color: rgba(#73C745, 0.25);
  }

  // c-modal-boon__disabled
  &__boon--disabled::before {
    cursor: not-allowed;
    background-color: rgba(#FF8F01, 0.25);
  }
}
</style>
