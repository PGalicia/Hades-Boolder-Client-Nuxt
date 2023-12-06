import { defineStore } from 'pinia'

/**
 * Types
 */
import type { BoonType } from '@/types/BoonType'
import type { GodType } from '@/types/GodType'
import type { SelectedBoonsType } from '@/types/SelectedBoonsType'

function _doGodsArrayMatch (arr1: GodType[], arr2: GodType[]): boolean {
  // Check if the arrays are the same length
  if (arr1.length !== arr2.length) {
    return false
  }

  // Check if all items exist and are in the same order
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].id !== arr2[i].id) {
      return false
    }
  }

  // Otherwise, return true
  return true
};

// export const useBoonStore = defineStore('boon', async () => {
export const useBoonStore = defineStore('boon', () => {
  /**
   * State
   */
  const boons = ref<BoonType[]>([])
  const gods = ref<GodType[]>([])
  const selectedBoonsIds = ref<number[]>([])

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
      if (!currentBoon) {
        continue
      }

      // Alphabetize gods
      const currentGods = currentBoon.gods.sort()
      // Check if the god name exists in the array
      const targetIndex = collection.findIndex(current => _doGodsArrayMatch(currentGods, current.gods.sort()))

      // If not add an object with that gods name
      if (targetIndex >= 0) {
        collection[targetIndex].boons.push(currentBoon)
      // If so add that object in that god object
      } else {
        collection.push({
          gods: currentGods,
          boons: [currentBoon]
        })
      }
    }

    return collection
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

  function doesBoonMeetPreqs (currentBoon: BoonType): boolean {
    // Get currentBoon (boon in param)
    // Check if the currentBoon' has prereq boons
    const prereqBoons = currentBoon.prereqs

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

  function isBoonIdInSelectedBoonsListIds (boonId: number): boolean {
    return selectedBoonsIds.value.includes(boonId)
  }

  function clearSelectedBoonsListIds () {
    selectedBoonsIds.value = []
  }

  return {
    boons,
    gods,
    selectedBoonsIds,
    addToSelectedBoons,
    getBoonById,
    getSelectedBoons,
    getUnselectedBoons,
    doesBoonMeetPreqs,
    isBoonIdInSelectedBoonsListIds,
    clearSelectedBoonsListIds
  }
})
