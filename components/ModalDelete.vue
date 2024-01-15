<script setup lang="ts">
/**
 * Imports
 */
// Constants
import { QUERY_PARAM_WEAPON, QUERY_PARAM_BOONS } from '@/constants/Settings'

// Stores
import { useBoonStore } from '@/stores/boons'

// Types
import type { BoonType } from '@/types/BoonType'
import type { WeaponType } from '@/types/WeaponType'

/**
 * Constants
 */
const router = useRouter()
const route = useRoute()

/**
 * Props
 */
const props = defineProps({
  build: {
    type: Object as PropType<BoonType | WeaponType>,
    required: true
  }
})

/**
 * Emits
 */
const emit = defineEmits(['closeModal'])

/**
 * Stores
 */
const { clearSelectedWeaponId, removeABoonInListIds } = useBoonStore()

function isBuildABoon () {
  return props.build.type === 'boon'
}

function isBuildAWeapon () {
  return !isBuildABoon()
}

function onDeleteButtonPress () {
  const currentQueryParams = { ...route.query }

  if (isBuildAWeapon()) {
    // Delete weapon
    delete currentQueryParams[QUERY_PARAM_WEAPON]

    clearSelectedWeaponId()
  } else {
    // Grab the boon list query param and decode it
    // Remove the target id
    // Encode it
    // Update query param
    const boonList = JSON.parse(decodeURIComponent(currentQueryParams[QUERY_PARAM_BOONS] as string))
    const targetIndex = boonList.findIndex((id: number) => id === props.build.id)

    if (targetIndex >= 0) {
      boonList.splice(targetIndex, 1)

      if (boonList.length === 0) {
        delete currentQueryParams[QUERY_PARAM_BOONS]
      } else {
        currentQueryParams[QUERY_PARAM_BOONS] = encodeURIComponent(JSON.stringify(boonList))
      }

      removeABoonInListIds(props.build.id)
    }
  }

  // Push the updated query params
  router.replace({ query: currentQueryParams })

  // Close modal
  emit('closeModal')
}
</script>

<template>
  <ModalBase
    class="c-modal--delete"
    title="Delete Boon"
    :is-full-size-on-mobile="false"
    @close-modal="emit('closeModal')"
  >
    <div class="mb-4 text-center text-lg">
      Are you sure you want to remove <span class="font-bold">{{ props.build.name }}</span>?
    </div>
    <div class="flex flex-col gap-3">
      <ButtonMain button-text="Delete" @click="onDeleteButtonPress" />
      <ButtonMain button-text="Cancel" button-type="secondary" @click="emit('closeModal')" />
    </div>
  </ModalBase>
</template>

<style lang="scss">
.c-modal--delete .c-modal__main {
  height: auto;
  max-height: 950px;
  max-width: 550px;
}
</style>
