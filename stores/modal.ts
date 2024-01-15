/**
 * Imports
 */
// Constants
import { FILTER_TYPE_BOONS, FILTER_TYPE_WEAPONS } from '@/constants/FilterType'

// Types
import type { BoonType } from '@/types/BoonType'
import type { WeaponType } from '@/types/WeaponType'

export const useModalStore = defineStore('modal', () => {
  /**
   * States
   */
  const isModalBuildActive = ref(false)
  const isModalDeleteActive = ref(false)
  const initiallySelectedType = ref<string>(FILTER_TYPE_BOONS)
  // @TODO: There's a crap top of places where I have 'BoonType | WeaponType'. I really need to update this
  // or combine the types
  const selectedBuild = ref<BoonType | WeaponType | null>(null)

  /**
   * Getters
   */
  function isAnyModalActive () {
    return isModalBuildActive.value || isModalDeleteActive.value
  }

  /**
   * Actions
   */
  function openModalBuild () {
    isModalBuildActive.value = true
  }

  function closeModalBuild () {
    isModalBuildActive.value = false

    // Make sure to reset selection when closing modal
    initiallySelectedType.value = FILTER_TYPE_BOONS
  }

  function openModalDelete () {
    if (selectedBuild.value) {
      isModalDeleteActive.value = true
    }
  }

  function closeModalDelete () {
    isModalDeleteActive.value = false

    selectedBuild.value = null
  }

  function updateInitiallySelectedTypeToWeapon () {
    initiallySelectedType.value = FILTER_TYPE_WEAPONS
  }

  return {
    selectedBuild,
    initiallySelectedType,
    isModalBuildActive,
    isModalDeleteActive,
    openModalBuild,
    closeModalBuild,
    openModalDelete,
    closeModalDelete,
    updateInitiallySelectedTypeToWeapon,
    isAnyModalActive
  }
})
