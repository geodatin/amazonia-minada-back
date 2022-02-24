import { IInvasionDTO } from '../dtos/IInvasionDTO'
import { ISearchDTO } from '../dtos/ISearchDTO'

export function groupInvasions(
  reserveInvasions: IInvasionDTO[],
  invasions: IInvasionDTO[]
): IInvasionDTO[] {
  const invasionsMap = new Map<String, IInvasionDTO>()

  reserveInvasions.forEach((invasion: IInvasionDTO) =>
    invasionsMap.set(invasion.id, invasion)
  )

  invasions.forEach((invasion: IInvasionDTO) =>
    invasionsMap.set(invasion.id, invasion)
  )

  return Array.from(invasionsMap.values())
}

export function groupResults(
  reserveResults: ISearchDTO[],
  unityResults: ISearchDTO[]
): ISearchDTO[] {
  const resultsMap = new Map<string | number, ISearchDTO>()

  reserveResults.forEach((result) => {
    resultsMap.set(result.value, result)
  })

  unityResults.forEach((result) => {
    resultsMap.set(result.value, result)
  })

  const results = Array.from(resultsMap.values()).sort((a, b) => {
    if (typeof a.value === 'string' && typeof b.value === 'string') {
      return a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1
    }
    return a.value > b.value ? 1 : -1
  })

  return results
}
