import { IInvasionDTO } from '../dtos/IInvasionDTO'

export function groupInvasions(
  reserveInvasions: IInvasionDTO[],
  invasions: IInvasionDTO[]
): IInvasionDTO[] {
  const invasionsMap = new Map<String, IInvasionDTO>()

  reserveInvasions.forEach((invasion: IInvasionDTO) =>
    invasionsMap.set(invasion.process, invasion)
  )

  invasions.forEach((invasion: IInvasionDTO) =>
    invasionsMap.set(invasion.process, invasion)
  )

  return Array.from(invasionsMap.values())
}
