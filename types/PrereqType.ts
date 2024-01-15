import type { GodType } from '@/types/GodType'

export type BoonPrereqType = {
  god: GodType | null,
  required: number,
  boons: number[]
}
