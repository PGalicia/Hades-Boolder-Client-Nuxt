/**
 * Imports
 */
// Constants
import { FILTER_TYPE_BOONS, FILTER_TYPE_WEAPONS } from '@/constants/FilterType'

// Types
import type { BuildType } from '@/types/BuildType'

export const useModalStore = defineStore('modal', () => {
  /**
   * States
   */
  const isModalBuildActive = ref(false)
  const isModalDeleteActive = ref(false)
  const initiallySelectedType = ref<string>(FILTER_TYPE_BOONS)
  const selectedBuild = ref<BuildType | null>(null)

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
