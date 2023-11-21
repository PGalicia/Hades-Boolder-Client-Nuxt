<script setup lang="ts">
/**
 * Imports
 */
// Store
import type { BoonType } from '@/types/BoonType'

/**
 * Props
 */
const props = defineProps({
  boons: {
    type: Array as PropType<BoonType[]>,
    required: true
  }
})

/**
 * Computed
 */
const getGodNames = computed(() => {
  const { gods } = props.boons[0]

  return { godFirst: gods[0], godSecond: gods[1] }
})
</script>

<template>
  <div class="c-list-boon w-full">
    <GodLabel v-bind="getGodNames" />
    <div class="c-list-boon__list">
      <BoonCard
        v-for="(boon, index) in props.boons"
        :key="index"
        :boon="boon"
        class="mb-8"
      />
    </div>
  </div>
</template>

<style lang="scss">
.c-list-boon {}
</style>
