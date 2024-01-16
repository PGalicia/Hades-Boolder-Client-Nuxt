<script setup lang="ts" generic="T extends BuildType">
/**
 * Imports
 */
// Store
import { useBoonStore } from '@/stores/boons'

// Type
import type { BuildType } from '@/types/BuildType'
import type { BoonType } from '@/types/BoonType'
import type { WeaponType } from '@/types/WeaponType'

/**
 * Store
 */
const { getWeaponCategoryBasedOnId, getBoonById, isBoonIdInSelectedBoonsListIds } = useBoonStore()

/**
 * Props
 */
const props = defineProps<{
  build: T
}>()

/**
 * Constants
 */
const isABoon = isBuildABoon(props.build)
const isAWeapon = isBuildAWeapon(props.build)
</script>

<template>
  <div class="c-build-card border-2 cursor-pointer border-solid border-black box-border overflow-hidden bg-white rounded-lg relative py-4 px-6 w-full h-full">
    <!-- Name and Slot container -->
    <div class="flex gap-2 items-center">
      <!-- Name -->
      <div class="text-base font-bold">
        {{ props.build.name }}
      </div>

      <!-- Slot/Weapon -->
      <div
        v-if="isABoon && (props.build as BoonType).slot"
        class="text-xs ml-auto"
      >
        {{ (props.build as BoonType).slot!.slot.toUpperCase() }}
      </div>
      <div
        v-else-if="isAWeapon && getWeaponCategoryBasedOnId((props.build as WeaponType).categoryId)"
        class="text-xs ml-auto"
      >
        {{ getWeaponCategoryBasedOnId((props.build as WeaponType).categoryId)!.type.toUpperCase() }}
      </div>
    </div>

    <!-- Subtext -->
    <div
      v-if="isABoon"
      class="text-xs ml-auto"
    >
      <span>{{ capitalizeWord((props.build as BoonType).gods[0].god) }}</span>
      <template v-if="(props.build as BoonType).gods[1]">
        <span class="mx-1">&#10006;</span>
        <span>{{ capitalizeWord((props.build as BoonType).gods[1]!.god) }}</span>
      </template>
    </div>

    <!-- Description -->
    <div class="text-sm my-2">
      {{ props.build.description }}
    </div>

    <!-- Rarity strip -->
    <div
      class="w-3 h-full absolute top-0 left-0 bg-accentCommon border-r-2 border-solid border-black"
      :class="{
        'bg-accentLegendary': isABoon && (props.build as BoonType).rarity.rarity === 'legendary',
        'bg-accentDuo': isABoon && (props.build as BoonType).rarity.rarity === 'duo',
      }"
    />

    <div class="pl-2 flex text-sm">
      <div> &bull; {{ props.build.stats.name }}:</div>

      <!-- Boon tiers -->
      <div class="pl-1 text-primary font-bold">
        {{ props.build.stats.tiers[props.build.stats.tiers.length - 1].number }}
      </div>
    </div>

    <!-- Boon Prereqs -->
    <div
      v-if="isABoon && (props.build as BoonType).boonPrereqs.length > 0"
      class="grid-cols-2 text-sm grid mt-2 gap-x-0 gap-y-4 pt-4 px-0"
    >
      <div
        v-for="(prepreq, index) in (props.build as BoonType).boonPrereqs"
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

    <!-- Notes -->
    <template v-if="isABoon && (props.build as BoonType).notes.length > 0">
      <div class="text-xs pt-4 font-bold">
        Notes
      </div>
      <ul
        v-if="isABoon && (props.build as BoonType).notes.length > 0"
        class="text-xs list-disc pl-10"
      >
        <li
          v-for="(note, index) in (props.build as BoonType).notes"
          :key="index"
        >
          {{ note }}
        </li>
      </ul>
    </template>
  </div>
</template>

<style lang="scss">
.c-build-card {
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0.25rem 0.25rem 0 0 black;
  }
}
</style>
