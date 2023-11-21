export const useModalStore = defineStore('modal', () => {
  /**
   * States
   */
  const isModalActive = ref(false)

  /**
   * Actions
   */
  function openModal () {
    isModalActive.value = true
  }

  function closeModal () {
    isModalActive.value = false
  }

  return {
    isModalActive,
    openModal,
    closeModal
  }
})
