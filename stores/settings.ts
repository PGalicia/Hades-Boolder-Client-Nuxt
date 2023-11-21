export const useSettingStore = defineStore('setting', () => {
  /**
   * State
   */
  // This will track if the page renders to trigger certain logic
  const didPageRender = ref(false)

  return {
    didPageRender
  }
})
