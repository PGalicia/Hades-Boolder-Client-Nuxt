<script setup lang="ts">
/**
 * Props
 */
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  isFullSizeOnMobile: {
    type: Boolean,
    default: true
  }
})

/**
 * Emits
 */
const emit = defineEmits(['closeModal'])
</script>

<template>
  <div
    class="c-modal w-screen h-screen fixed top-0 left-0 z-50 bg-black/25 flex items-center justify-center p-4"
    @click.self="emit('closeModal')"
  >
    <div
      class="c-modal__main border-2 border-solid border-black rounded-lg w-full bg-white overflow-x-hidden hide-scrollbar"
      :class="{
        'c-modal__main--full-size': isFullSizeOnMobile
      }"
    >
      <div class="w-full h-fit bg-black text-white border-b-3 border-solid border-black py-2 px-4 flex justify-between">
        <div>
          {{ props.title }}
        </div>
        <div
          class="font-bold cursor-pointer hover:text-primary"
          @click="emit('closeModal')"
        >
          &#x2715;
        </div>
      </div>

      <div class="p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.c-modal {
  @media (max-width: 500px) {
    .c-modal__main--full-size {
      position: fixed;
      height: 100%;
      top: 0;
      left: 0;
      bottom: 0;
      transform: none;
      border-radius: 0;
    }

    .c-modal__boon { width: 100%; }
  }

  // c-modal__main
  &__main {
    height: 90%;
    max-height: 950px;
    max-width: 550px;
    box-shadow: 0.5rem 0.5rem 0 0 black;
  }
}
</style>
