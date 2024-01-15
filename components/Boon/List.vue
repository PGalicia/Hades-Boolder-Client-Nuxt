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
</script>

<template>
  <div class="c-list-boon w-full">
    <GodLabel :gods="props.boons[0].gods" />
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <BuildCard
        v-for="(boon, index) in props.boons"
        :key="index"
        :build="boon"
      />
    </div>
  </div>
</template>

<style lang="scss">
.c-list-boon {}
</style>
