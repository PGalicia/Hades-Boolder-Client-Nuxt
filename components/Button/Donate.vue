<script setup lang="ts">
// @TODO: I should probably clean this up and just use the ButtonMain component for this
/**
 * Imports
 */
// Constants
import { BUY_ME_A_COFFEE_LINK } from '@/constants/ExternalLinks'
</script>

<template>
  <a
    class="c-button-donate bg-[#ffd700] block px-4 py-2 rounded-lg border-2 border-solid border-black font-bold cursor-pointer text-center text-black"
    :href="BUY_ME_A_COFFEE_LINK"
    target="_blank"
  >
    <span class="hidden sm:block">Buy me a coffee</span>
    <span class="block sm:hidden">coffee?</span>
  </a>
</template>

<style lang="scss">
.c-button-donate {
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0.25rem 0.25rem 0 0 black;
  }
}
</style>
