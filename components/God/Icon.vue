<script setup lang="ts">
/**
 * Imports
 */
// Store
import { useBoonStore } from '@/stores/boons'

/**
 * Props
 */
const props = defineProps({
  godName: {
    type: String,
    required: true,
    // Check that godName is lowercase and that it is a valid god
    validator: (godName: string): boolean => {
      return godName === godName.toLowerCase() &&
        useBoonStore().gods.some(god => god.god === godName)
    }
  }
})
</script>

<template>
  <img
    :src="`/icons/gods/${props.godName}.png`"
    :alt="`${capitalizeWord(props.godName)} image`"
  >
</template>
