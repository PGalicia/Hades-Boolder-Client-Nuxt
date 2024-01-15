<script setup lang="ts">
/**
 * Props
 */
const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="c-build-card-placeholder cursor-pointer border-2 border-solid border-gray-500 box-border overflow-hidden bg-white rounded-lg relative py-4 px-6 w-full min-h-[8rem] h-full">
    <div
      v-if="text"
      class="font-bold text-gray-500 uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      {{ props.text }}
    </div>
  </div>
</template>

<style lang="scss">
.c-build-card-placeholder {
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0.25rem 0.25rem 0 0 rgb(107, 114, 128);
  }
}
</style>
