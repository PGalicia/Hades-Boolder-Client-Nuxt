import { defineStore } from 'pinia'

/**
 * Types
 */
import type { BoonType } from '@/types/BoonType'
import type { GodType } from '@/types/GodType'
import type { SelectedBoonsType } from '@/types/SelectedBoonsType'
import type { WeaponCategoriesType, WeaponType } from '@/types/WeaponType'
import type { SlotType } from '@/types/SlotType'

export const useBoonStore = defineStore('boon', () => {
  /**
   * State
   */
  const boons = ref<BoonType[]>([])
  const gods = ref<GodType[]>([])
  const slots = ref<SlotType[]>([])
  // @TODO: At this point, this store is not just boons. It's the 'build' so rename it to that
  const weapons = ref<WeaponType[]>([])
  const weaponCategories = ref<WeaponCategoriesType[]>([])
  const selectedBoonsIds = ref<number[]>([])
  const selectedWeaponId = ref<number>(-1)

  /**
   * Actions
   */
  function addToSelectedBoons (newBoonId: number) {
    // Find the boon based on the id
    const currentBoon = getBoonById(newBoonId)

    // Boon does not exist OR boonId is already in selectedBoonsIds
    if (!currentBoon || selectedBoonsIds.value.includes(newBoonId)) {
      return
    }

    // Grab current boon slot
    const currentBoonSlot = currentBoon?.slot

    // If there's a boon slot
    if (currentBoonSlot) {
      const unformattedSelectedBoons = getSelectedBoonsUnformatted()

      // Check if the boon slot already exists in the array
      const targetBoonSlot = unformattedSelectedBoons
        .findIndex(boon => boon.slot && boon.slot.id === currentBoonSlot.id)

      // If it does exist, replace it
      // If not, add it
      if (targetBoonSlot > -1) {
        unformattedSelectedBoons[targetBoonSlot] = currentBoon

        // Map the updated boons to seletedBoons
        selectedBoonsIds.value = unformattedSelectedBoons.map(boon => boon.id)
      } else {
        selectedBoonsIds.value.push(newBoonId)
      }
    } else {
      // If not, add it
      selectedBoonsIds.value.push(newBoonId)
    }
  }

  function addSelectedWeapon (weaponId: number) {
    selectedWeaponId.value = weaponId
  }

  function removeABoonInListIds (boonId: number) {
    selectedBoonsIds.value = selectedBoonsIds.value.filter(id => id !== boonId)
  }

  function clearSelectedBoonsListIds () {
    selectedBoonsIds.value = []
  }

  function clearSelectedWeaponId () {
    selectedWeaponId.value = -1
  }

  /**
   * Getters
   */
  function getBoonById (boonId: number): BoonType | null {
    return boons.value.find(({ id }) => id === boonId) || null
  }

  function getSelectedBoons (): SelectedBoonsType[] {
    const collection = []

    for (const id of selectedBoonsIds.value.sort((a, b) => a - b)) {
      const currentBoon = getBoonById(id)

      // If currentBoon doesn't exist, then continue to the next iteration
      if (!currentBoon || currentBoon.slot) {
        continue
      }

      // Check if the god name exists in the array
      // If there are two gods for a boon, just input them as under 'duo'
      const currentGod = currentBoon.gods.length === 2
        ? 'duo'
        : currentBoon.gods[0].god
      const targetIndex = collection.findIndex(current => current.godName.toLowerCase() === currentGod.toLowerCase())

      // If not add an object with that gods name
      if (targetIndex >= 0) {
        collection[targetIndex].boons.push(currentBoon)
      // If so add that object in that god object
      } else {
        collection.push({
          godName: capitalizeWord(currentGod),
          boons: [currentBoon]
        })
      }
    }

    return collection
  }

  function getSelectedWeapon (): WeaponType | undefined {
    return weapons.value.find(({ id }) => id === selectedWeaponId.value)
  }

  function getSelectedBoonsUnformatted (): BoonType[] {
    const collection: BoonType[] = []

    selectedBoonsIds.value.forEach((boonId) => {
      const currentBoon = getBoonById(boonId)
      if (currentBoon) {
        collection.push(currentBoon)
      }
    })

    return collection
  }

  function getUnselectedBoons (name: string) {
    return boons.value
      .filter(({ gods }) => gods.some(({ god }) => god === name))
      .filter(boon => !selectedBoonsIds.value.includes(boon.id))
  }

  function getAllUnselectedBoons () {
    return boons.value
      .filter(boon => !selectedBoonsIds.value.includes(boon.id))
  }

  function getUnselectedWeapons (targetWeaponCategoryId: number) {
    return weapons.value
      .filter(({ categoryId }) => categoryId === targetWeaponCategoryId)
      .filter(({ id }) => selectedWeaponId.value !== id)
  }

  function getAllUnselectedWeapons () {
    return weapons.value
      .filter(({ id }) => selectedWeaponId.value !== id)
  }

  function getWeaponCategoryBasedOnId (categoryId: number) {
    return weaponCategories.value.find(({ id }) => id === categoryId)
  }

  function getSelectedBoonInSpecifiedSlot (slotId: number): BoonType | undefined {
    return getSelectedBoonsUnformatted().find(({ slot = null }) => slot && slot.id === slotId)
  }

  function doesBoonMeetPreqs (currentBoon: BoonType): boolean {
    // Check if the currentBoon has prereq weapons
    const prereqWeapons = currentBoon.weaponPrereqs

    // If weaponId is not equal to the selectedWeaponId, return false
    for (const weaponId of prereqWeapons) {
      if (selectedWeaponId.value !== weaponId) {
        return false
      }
    }

    // Check if the currentBoon has invalidWeapons
    const invalidWeapons = currentBoon.invalidWeapons

    // If the current selectedWeaponId is in invalidWeapons, return false
    if (invalidWeapons.includes(selectedWeaponId.value)) {
      return false
    }

    // Check if the currentBoon has invalidBoons
    const invalidBoons = currentBoon.invalidBoons

    // If the any current selectedBoonsIds is in invalidBoons, return false
    if (invalidBoons.some(boonId => selectedBoonsIds.value.includes(boonId))) {
      return false
    }

    // Check if the currentBoon' has prereq boons
    const prereqBoons = currentBoon.boonPrereqs

    for (const boonList of prereqBoons) {
      // For each prepreq object, find the required value
      const requiredPrereq = boonList.required

      // The number goes up if prereq can be found in selectedBoonsIds
      let count = 0

      // Loop through boonList and how many prereq boons are already in selectedBoonsIds
      boonList.boons.forEach((boon) => {
        if (selectedBoonsIds.value.includes(boon)) {
          count++
        }
      })

      // If the prereq count did not meet the requirement, return false
      if (requiredPrereq > count) {
        return false
      }
    }

    return true
  }

  function doesWeaponMeetPrereqs (weaponId: number) {
    for (const boonId of selectedBoonsIds.value) {
      // Current boon
      const currentBoon = getBoonById(boonId)

      // List of invalid weapons
      const invalidWeapons = currentBoon?.invalidWeapons || []

      // If currentWeapon is in invalidWeapons list, return false
      if (invalidWeapons?.includes(weaponId)) {
        return false
      }
    }

    return true
  }

  function isBoonIdInSelectedBoonsListIds (boonId: number): boolean {
    return selectedBoonsIds.value.includes(boonId)
  }

  return {
    boons,
    gods,
    slots,
    weaponCategories,
    weapons,
    getWeaponCategoryBasedOnId,
    selectedBoonsIds,
    selectedWeaponId,
    addToSelectedBoons,
    addSelectedWeapon,
    clearSelectedBoonsListIds,
    clearSelectedWeaponId,
    removeABoonInListIds,
    getBoonById,
    getSelectedBoons,
    getSelectedWeapon,
    getUnselectedWeapons,
    getAllUnselectedWeapons,
    getUnselectedBoons,
    getAllUnselectedBoons,
    getSelectedBoonInSpecifiedSlot,
    doesBoonMeetPreqs,
    doesWeaponMeetPrereqs,
    isBoonIdInSelectedBoonsListIds
  }
})
