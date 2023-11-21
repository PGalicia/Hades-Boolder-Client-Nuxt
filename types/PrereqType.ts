import type { GodType } from '@/types/GodType'

export type PrereqType = {
  god: GodType | null,
  required: number,
  boons: number[]
}
