<script setup lang="ts">
/**
 * Imports
 */
// Stores
import { useBoonStore } from '@/stores/boons'
import { useModalStore } from '@/stores/modal'

/**
 * Stores
 */
const { slots } = storeToRefs(useBoonStore())
const {
  getSelectedWeapon,
  getSelectedBoonInSpecifiedSlot,
  getSelectedBoons
} = useBoonStore()
const { openModalBuild, updateInitiallySelectedTypeToWeapon } = useModalStore()

/**
 * Emits
 */
const emit = defineEmits(['buildClick'])

/**
 * Actions
 */
function handleWeaponPlaceholderClick () {
  // Update type
  updateInitiallySelectedTypeToWeapon()

  // Open modal
  openModalBuild()
}
</script>

<template>
  <div class="flex flex-col h-max gap-8 mb-8">
    <!-- Cores -->
    <div class="p-6 bg-gray-200 sm:rounded-lg flex flex-col gap-4">
      <div class="text-2xl font-bold">
        Cores
      </div>

      <!-- Slots -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Weapon -->
        <div>
          <BuildCard
            v-if="getSelectedWeapon()"
            :build="getSelectedWeapon()!"
            @click="emit('buildClick', getSelectedWeapon()!)"
          />
          <BuildCardPlaceholder
            v-else
            text="weapon"
            @click="handleWeaponPlaceholderClick"
          />
        </div>
        <!-- Slots -->
        <div
          v-for="slot in slots"
          :key="slot.id"
        >
          <BuildCard
            v-if="getSelectedBoonInSpecifiedSlot(slot.id)"
            :build="getSelectedBoonInSpecifiedSlot(slot.id)!"
            @click="emit('buildClick', getSelectedBoonInSpecifiedSlot(slot.id)!)"
          />
          <BuildCardPlaceholder
            v-else
            :text="slot.slot"
            @click="openModalBuild"
          />
        </div>
      </div>
    </div>

    <!-- Other Boons -->
    <div>
      <div class="p-6 bg-gray-200 sm:rounded-lg flex flex-col gap-4">
        <div class="text-2xl font-bold">
          Boons
        </div>

        <div class="flex flex-col gap-6">
          <BuildCardPlaceholder
            v-if="getSelectedBoons().length === 0"
            text="boon"
            @click="openModalBuild"
          />
          <div
            v-for="(god, i) in getSelectedBoons()"
            :key="i"
            class="c-list-boon w-full"
          >
            <GodLabel :gods="god.boons[0].gods" />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BuildCard
                v-for="(boon, j) in god.boons"
                :key="j"
                :build="boon"
                @click="emit('buildClick', boon)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
