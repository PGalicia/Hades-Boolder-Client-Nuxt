<script setup lang="ts">
/**
 * Props
 */
const props = defineProps({
  godFirst: {
    type: Object,
    required: true
  },
  godSecond: {
    type: Object,
    required: false,
    default: null
  }
})
</script>

<template>
  <div class="c-label-god pb-4 flex items-center text-3xl font-bold">
    <div class="flex items-center">
      <h4>{{ capitalizeWord(props.godFirst.god) }}</h4>
      <GodIcon
        class="w-8 h-8"
        :god-name="props.godFirst.god"
      />
    </div>

    <div v-if="props.godSecond" class="mr-2 text-base">
      &#10006;
    </div>

    <div v-if="props.godSecond" class="flex items-center">
      <h4>{{ capitalizeWord(props.godSecond.god) }}</h4>
      <GodIcon
        class="w-8 h-8"
        :god-name="props.godSecond.god"
      />
    </div>
  </div>
</template>

<style lang="scss">
.c-label-god {}
</style>
