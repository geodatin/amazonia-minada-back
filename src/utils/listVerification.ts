import { IFiltersDTO } from '../dtos/IFiltersDTO'

/**
 * This function check when reserve invasions should be listed according to the filters.
 * Ex: When some unity is given and none reserve filter (reserve, reserveEthnicity or reservePhase)
 * is specified, then reserve invasions shouldn't be listed.
 */
export function checkIfShouldListReserveInvasions(
  filters: IFiltersDTO
): boolean {
  return (
    !(filters.unity && filters.unity.length > 0) ||
    (filters.reserve && filters.reserve.length > 0) ||
    (filters.reserveEthnicity && filters.reserveEthnicity.length > 0) ||
    (filters.reservePhase && filters.reservePhase.length > 0) ||
    false
  )
}

/**
 * This function check when unity invasions should be listed according to the filters
 * Ex: When some reserve filter is given (reserve, reserveEthnicity or reservePhase)
 * and no unity is specified, then unity invasions shouldn't be listed.
 */
export function checkIfShouldListUnityInvasions(filters: IFiltersDTO): boolean {
  return (
    !(
      (filters.reserve && filters.reserve.length > 0) ||
      (filters.reserveEthnicity && filters.reserveEthnicity.length > 0) ||
      (filters.reservePhase && filters.reservePhase.length > 0)
    ) ||
    (filters.unity && filters.unity.length > 0) ||
    false
  )
}
