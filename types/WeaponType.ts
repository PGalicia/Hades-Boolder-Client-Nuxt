import type { StatType } from '@/types/StatType'

export type WeaponCategoriesType = {
  id: number,
  type: string,
  name: string
}

export type WeaponType = {
  id: number,
  type: 'weapon',
  name: string,
  categoryId: number,
  description: string,
  stats: StatType
}
