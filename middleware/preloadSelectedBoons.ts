/**
 * Imports
 */
// Constants
import { QUERY_PARAM_BOONS, QUERY_PARAM_WEAPON } from '@/constants/Settings'

// Store
import { useBoonStore } from '@/stores/boons'
import { useSettingStore } from '@/stores/settings'

// Types
import type { BoonType } from '@/types/BoonType'
import type { GodType } from '@/types/GodType'
import type { WeaponCategoriesType, WeaponType } from '@/types/WeaponType'
import type { SlotType } from '@/types/SlotType'

/**
 * Add selectedBoon to store if there's any in the query param
 */
export default defineNuxtRouteMiddleware(async ({ query: toQuery }) => {
  // Grab the necessary functions from the store
  const { boons, gods, slots, weaponCategories, weapons } = storeToRefs(useBoonStore())
  const { getBoonById, addToSelectedBoons, addSelectedWeapon, doesBoonMeetPreqs } = useBoonStore()
  const { didPageRender } = storeToRefs(useSettingStore())

  // Grab all boons and gods
  const { data: allBoons } = await useFetch<BoonType[]>('/api/boons')
  const { data: allGods } = await useFetch<GodType[]>('/api/gods')
  const { data: allSlots } = await useFetch<SlotType[]>('/api/slots')
  const { data: allWeaponCategories } = await useFetch<WeaponCategoriesType[]>('/api/weaponCategories')
  const { data: allWeapons } = await useFetch<WeaponType[]>('/api/weapons')

  if (allBoons.value) {
    boons.value = allBoons.value
  }

  if (allGods.value) {
    gods.value = allGods.value
  }

  if (allSlots.value) {
    slots.value = allSlots.value
  }

  if (allWeaponCategories.value) {
    weaponCategories.value = allWeaponCategories.value
  }

  if (allWeapons.value) {
    weapons.value = allWeapons.value
  }

  // If boons does not exist, throw an error
  if (boons.value.length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong'
    })
  }

  // If the page already renders, then no need to trigger the logic below
  // This is done to prevent unnecessary duplication when adding boons to list
  if (didPageRender.value) {
    return
  } else {
    didPageRender.value = true
  }

  let boonList: number[]
  let weaponId: number

  // Grab boons and weapon from url query
  // If parsing the query fails, setup up default values
  try {
    boonList = JSON.parse(decodeURIComponent(toQuery?.[QUERY_PARAM_BOONS] as string))
  } catch {
    boonList = []
  }

  try {
    weaponId = JSON.parse(decodeURIComponent(toQuery?.[QUERY_PARAM_WEAPON] as string))
  } catch {
    weaponId = -1
  }

  // Add the weapon in url query param to vuex
  // Weapon need to be added first since certain boons rely on selected weapons
  if (weaponId >= 0) {
    addSelectedWeapon(weaponId)
  }

  // Add the boon in url query param to vuex
  boonList.forEach((boonId) => {
    const currentBoon = getBoonById(boonId)

    // If currentBoon is null, return
    if (!currentBoon) {
      return
    }

    // Determine if boon selected meet the boon prereq
    const canBeIncluded = doesBoonMeetPreqs(currentBoon)

    // If it can be included, include it
    if (canBeIncluded) {
      addToSelectedBoons(boonId)
    }
  })
})
