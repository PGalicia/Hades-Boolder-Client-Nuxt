/**
 * Imports
 */
// Types
import type { BuildType } from '@/types/BuildType'

export default function<T extends BuildType> (build: T) {
  return build.type === 'boon'
}
