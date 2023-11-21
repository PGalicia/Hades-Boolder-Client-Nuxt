<script setup lang="ts">
/**
 * Props
 */
const props = defineProps({
  // Determine if button is disabled
  isButtonDisabled: {
    type: Boolean,
    required: false,
    default: false
  },

  // Button text
  buttonText: {
    type: String,
    required: true
  }
})

/**
 * Emits
 */
const emit = defineEmits(['click'])

/**
 * Event handlers
 */
function handleButtonClick () {
  emit('click')
}
</script>

<template>
  <button
    class="c-button max-w-xs focus:outline-none py-2 px-24 border border-solid text-white w-full font-bold box-border rounded-full text-base my-0 mx-auto"
    :class="[
      {
        'hover:enabled:bg-secondaryHover hover:enabled:border-secondaryHover border-secondary bg-secondary cursor-pointer': !props.isButtonDisabled,
        'bg-slate-700 border-slate-700 cursor-not-allowed': props.isButtonDisabled
      }
    ]"
    :disabled="props.isButtonDisabled"
    @click="handleButtonClick"
  >
    {{ props.buttonText }}
  </button>
</template>

<style lang="scss">
.c-button {}
</style>
