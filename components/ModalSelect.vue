<script setup lang="ts">
/**
 * Imports
 */
// Store
import { useBoonStore } from '@/stores/boons'
import { useModalStore } from '@/stores/modal'

// Types
import type { BoonType } from '@/types/BoonType'
import type { FilterType } from '@/types/FilterType'

// Constants
import { QUERY_PARAM_BOONS, QUERY_PARAM_WEAPON } from '@/constants/Settings'
import { FILTER_TYPE_BOONS, FILTER_TYPE_WEAPONS, FILTER_ALL } from '@/constants/FilterType'

/**
 * Store
 */
const {
  selectedBoonsIds,
  selectedWeaponId,
  gods,
  weaponCategories
} = storeToRefs(useBoonStore())
const {
  addToSelectedBoons,
  getUnselectedBoons,
  getUnselectedWeapons,
  getAllUnselectedWeapons,
  getAllUnselectedBoons,
  doesBoonMeetPreqs,
  addSelectedWeapon
} = useBoonStore()
const { initiallySelectedType } = storeToRefs(useModalStore())
const { closeModalBuild } = useModalStore()

/**
 * Constants
 */
const typeList: FilterType[] = [
  { id: 0, value: FILTER_TYPE_BOONS },
  { id: 1, value: FILTER_TYPE_WEAPONS }
]

/**
 * Refs
 */
const selectedType = ref(initiallySelectedType.value)
const selectedWeaponCategory = ref(FILTER_ALL)
// @TODO: In reality, I should use all here but currently
// there's this lag when opening the modal because of the sheer size of the boons
// const selectedGod = ref(FILTER_ALL)
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
function handleTypeFilter (item: FilterType) {
  selectedType.value = item.value
}

function handleWeaponCategoryFilter (item: FilterType) {
  selectedWeaponCategory.value = item.value
}

function handleGodFilter (item: FilterType) {
  // Update the selected god
  selectedGod.value = item.value

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
  selectedGod.value = FILTER_ALL
  selectedBoon.value = null

  // Close modal
  closeModalBuild()
}

function handleWeaponSelection (weaponId: number) {
  // Add selected weapon
  addSelectedWeapon(weaponId)

  // Get current query params and add update selected boons
  const currentQueryParams = {
    ...route.query,
    [QUERY_PARAM_WEAPON]: encodeURIComponent(JSON.stringify(selectedWeaponId.value))
  }

  // Push the updated query params
  router.push({ query: currentQueryParams })

  // Close modal
  closeModalBuild()
}

function getCurrentBoonChoices (godName: string) {
  if (selectedGod.value === FILTER_ALL) {
    return getAllUnselectedBoons()
  }

  return getUnselectedBoons(godName)
}

function getCurrentWeaponCategories () {
  if (selectedWeaponCategory.value === FILTER_ALL) {
    return getAllUnselectedWeapons()
  }

  const categoryId = weaponCategories.value.find(({ type }) => type === selectedWeaponCategory.value)?.id

  if (categoryId !== undefined) {
    return getUnselectedWeapons(categoryId)
  }

  return []
}

function getBoonFilters () {
  // const filterGods = gods.value.map(({ god }, index) => ({ id: index + 1, value: god }))
  const filterGods = gods.value.map(({ god }, index) => ({ id: index, value: god }))

  return [
    // { id: 0, value: FILTER_ALL },
    ...filterGods
  ]
}

function getWeaponFilters () {
  const filterWeaponCategories = weaponCategories.value.map(({ type }, index) => ({ id: index + 1, value: type }))

  return [
    { id: 0, value: FILTER_ALL },
    ...filterWeaponCategories
  ]
}
</script>

<template>
  <ModalBase
    title="Select A Boon"
    @close-modal="closeModalBuild()"
  >
    <FilterDefault
      :list="typeList"
      :selected="selectedType"
      name="Type"
      @filter-click="handleTypeFilter"
    />

    <FilterDefault
      v-if="selectedType === FILTER_TYPE_BOONS"
      :list="getBoonFilters()"
      :selected="selectedGod"
      name="Gods"
      class="py-4"
      @filter-click="handleGodFilter"
    />
    <FilterDefault
      v-else-if="selectedType === FILTER_TYPE_WEAPONS"
      :list="getWeaponFilters()"
      :selected="selectedWeaponCategory"
      name="Categories"
      class="py-4"
      @filter-click="handleWeaponCategoryFilter"
    />

    <div class="w-fit my-8 mx-auto md:py-0">
      <template v-if="selectedType === FILTER_TYPE_BOONS">
        <div
          v-for="(boon, index) in getCurrentBoonChoices(selectedGod)"
          :key="index"
          class="c-modal-select__boon cursor-pointer relative"
          :class="{
            'c-modal-select__boon--disabled': !doesBoonMeetPreqs(boon)
          }"
          @click="handleBoonSelection(boon); handleBoonAddition()"
        >
          <BuildCard
            :build="boon"
            class="w-full"
          />
        </div>
      </template>
      <template v-else-if="selectedType === FILTER_TYPE_WEAPONS">
        <div
          v-for="(weapon, index) in getCurrentWeaponCategories()"
          :key="index"
          class="c-modal-select__boon cursor-pointer relative"
          @click="handleWeaponSelection(weapon.id)"
        >
          <BuildCard :build="weapon" />
        </div>
      </template>
    </div>
  </ModalBase>
</template>

<style lang="scss">
.c-modal-select {
  // c-modal-select__boon
  &__boon {
    margin: 0 auto 1.5rem;
  }

  &__boon:not(.c-modal-select__boon--disabled):hover::before,
  &__boon--disabled::before {
    position: absolute;
    content: '';
    height: 100%;
    width: 100%;
    z-index: 1;
    border-radius: 10px;
  }

  &__boon:not(.c-modal-select__boon--disabled):hover::before {
    background-color: rgba(#73C745, 0.25);
  }

  // c-modal-select__boon--disabled
  &__boon--disabled::before {
    cursor: not-allowed;
    background-color: rgba(#FF8F01, 0.25);
  }
}
</style>
