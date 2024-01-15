<script setup lang="ts">
/**
 * Imports
 */
// Type
import type { GodType } from '@/types/GodType'

/**
 * Props
 */
const props = defineProps({
  gods: {
    type: Array as PropType<GodType[]>,
    required: true
  }
})

/**
 * Computed
 */
const isADuo = computed(() => {
  return props.gods.length > 1
})

const displayLabel = computed(() => {
  if (isADuo.value) {
    return 'Duo'
  } else {
    return capitalizeWord(props.gods[0].god)
  }
})
</script>

<template>
  <div class="c-label-god pb-4 flex items-center text-large font-bold">
    <h4>{{ displayLabel }}</h4>
    <GodIcon
      v-if="!isADuo"
      class="w-4 aspect-square"
      :god-name="props.gods[0].god"
    />
  </div>
</template>

<style lang="scss">
.c-label-god {}
</style>
