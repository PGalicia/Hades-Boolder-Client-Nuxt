import { QUERY_PARAM_BOONS } from '@/constants/Settings'

import { useBoonStore } from '@/stores/boons'
import { useSettingStore } from '@/stores/settings'

/**
 * Add selectedBoon to store if there's any in the query param
 */
export default defineNuxtRouteMiddleware(({ query: toQuery }) => {
  // Grab the necessary functions from the store
  const { boons, getBoonById, addToSelectedBoons, doesBoonMeetPreqs } = useBoonStore()
  const { didPageRender } = storeToRefs(useSettingStore())

  // console.log('boons', boons)
  if (boons.length === 0) {
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

  try {
    // Grab boon list from url query
    boonList = JSON.parse(decodeURIComponent(toQuery?.[QUERY_PARAM_BOONS] as string))
  } catch {
    // If parsing the boon list in query fails, return
    return
  }

  // If there are no boonList or it's formatted incorrectly, return
  if (!boonList) {
    return
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
      // debugger
      addToSelectedBoons(boonId)
    }
  })
})
