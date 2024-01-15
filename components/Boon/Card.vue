<script setup lang="ts">
/**
 * Imports
 */
// Store
import { useBoonStore } from '@/stores/boons'

// Type
import type { BoonType } from '@/types/BoonType'

/**
 * Store
 */
const { getBoonById, isBoonIdInSelectedBoonsListIds } = useBoonStore()

/**
 * Props
 */
const props = defineProps({
  boon: {
    type: Object as PropType<BoonType>,
    required: true
  }
})
</script>

<template>
  <div class="c-card-boon flex">
    <div class="shadow-[0_0_25px_0_rgba(0,0,0,0.15)] box-border my-0 mx-auto overflow-hidden bg-white rounded-lg relative py-4 px-6 w-full md:w-80">
      <!-- Name and Slot container -->
      <div class="flex gap-2 mb-2 items-center">
        <!-- Name -->
        <div class="text-base font-bold">
          {{ props.boon.name }}
        </div>

        <!-- Slot -->
        <div
          v-if="props.boon.slot"
          class="text-xs"
        >
          {{ props.boon.slot.slot.toUpperCase() }}
        </div>
      </div>

      <!-- Description -->
      <div class="text-sm mb-2">
        {{ props.boon.description }}
      </div>

      <!-- Rarity strip -->
      <div
        class="w-3 h-full absolute top-0 left-0"
        :class="{
          'bg-accentCommon': props.boon.rarity.rarity === 'common',
          'bg-accentLegendary': props.boon.rarity.rarity === 'legendary',
          'bg-accentDuo': props.boon.rarity.rarity === 'duo',
        }"
      />

      <div class="pl-2 flex text-sm">
        <div> &bull; {{ props.boon.stats.name }}:</div>

        <!-- Boon tiers -->
        <div class="pl-1 text-primary font-bold">
          {{ props.boon.stats.tiers[0].number }}
        </div>
      </div>

      <!-- Boon Prereqs -->
      <div
        v-if="props.boon.boonPrereqs.length > 0"
        class="grid-cols-2 text-sm grid mt-2 gap-x-0 gap-y-4 py-4 px-0"
      >
        <div
          v-for="(prepreq, index) in props.boon.boonPrereqs"
          :key="index"
        >
          <div class="pb-2 flex items-center font-bold">
            <GodIcon
              v-if="prepreq.god"
              class="w-6"
              :god-name="prepreq.god.god"
            />
            <span>{{ capitalizeWord(numberToWords(prepreq.required)) }} of each:</span>
          </div>

          <ul class="list-disc pl-10">
            <li
              v-for="boonId in prepreq.boons"
              :key="boonId"
              class="pb-1"
              :class="{
                'text-primary font-bold': isBoonIdInSelectedBoonsListIds(boonId)
              }"
            >
              {{ getBoonById(boonId)?.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.c-card-boon {}
</style>
