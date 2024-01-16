import type { RarityType } from '@/types/RarityType'
import type { GodType } from '@/types/GodType'
import type { SlotType } from '@/types/SlotType'
import type { StatType } from '@/types/StatType'
import type { BoonPrereqType } from '@/types/PrereqType'

export type BoonType = {
  id: number,
  type: 'boon',
  gods: GodType[]
  rarity: RarityType,
  slot: SlotType | null,
  name: string,
  description: string,
  stats: StatType,
  weaponPrereqs: number[],
  invalidWeapons: number[],
  boonPrereqs: BoonPrereqType[],
  invalidBoons: number[],
  notes: string
}
