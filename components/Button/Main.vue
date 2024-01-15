<script lang="ts">
/**
 * Constants
 */
const BUTTON_PRIMARY = 'primary'
const BUTTON_SECONDARY = 'secondary'
const VALID_BUTTON_TYPES = [BUTTON_PRIMARY, BUTTON_SECONDARY]
</script>

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
  },
  buttonType: {
    type: String,
    default: BUTTON_PRIMARY,
    validator: (type: string) => {
      return VALID_BUTTON_TYPES.includes(type)
    }
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
    class="c-button px-4 py-2 rounded-lg border-2 border-solid border-black font-bold cursor-pointer text-center text-black"
    :class="{
      'bg-primary': props.buttonType === BUTTON_PRIMARY,
      'bg-slate-500': props.buttonType === BUTTON_SECONDARY
    }"
    :disabled="props.isButtonDisabled"
    @click="handleButtonClick"
  >
    {{ props.buttonText }}
  </button>
</template>

<style lang="scss">
.c-button {
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0.25rem 0.25rem 0 0 black;
  }
}
</style>
