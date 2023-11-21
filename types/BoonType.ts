import type { RarityType } from '@/types/RarityType'
import type { GodType } from '@/types/GodType'
import type { SlotType } from '@/types/SlotType'
import type { StatType } from '@/types/StatType'
import type { PrereqType } from '@/types/PrereqType'

export type BoonType = {
  id: number,
  gods: GodType[]
  rarity: RarityType,
  slot: SlotType | null,
  name: string,
  description: string,
  stats: StatType,
  prereqs: PrereqType[],
  notes: string
}
