<script setup lang="ts">
/**
 * Imports
 */
// Types
import type { FilterType } from '@/types/FilterType'

/**
 * Props
 */
const props = defineProps({
  list: {
    type: Array as PropType<FilterType[]>,
    required: true
  },
  selected: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

/**
 * Emits
 */
const emit = defineEmits(['filterClick'])

</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <div>{{ name }}:</div>
    <div
      v-for="item in props.list"
      :key="item.id"
      class="border-2 border-solid hover:border-primary py-1 px-2 cursor-pointer rounded w-fit font-bold text-base"
      :class="{
        'border-black': item.value !== props.selected,
        ['border-primary bg-primary text-white']: item.value === props.selected
      }"
      @click="emit('filterClick', item)"
    >
      {{ item.value }}
    </div>
  </div>
</template>
