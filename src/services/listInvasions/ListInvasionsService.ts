import { inject, injectable } from 'tsyringe'

import { IFiltersDTO } from '../../dtos/IFiltersDTO'
import { IInvasionDTO } from '../../dtos/IInvasionDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'

@injectable()
class ListInvasionsService {
  constructor(
    @inject('ReserveInvasionRepository')
    private reserveInvasionRepository: IReserveInvasionRepository,

    @inject('InvasionRepository')
    private invasionRepository: IInvasionRepository
  ) {}

  async execute(
    filters: IFiltersDTO,
    enableUnity: boolean = true,
    enableReserve: boolean = true
  ): Promise<IInvasionDTO[]> {
    let reserveInvasions: IInvasionDTO[] = []
    let invasions: IInvasionDTO[] = []

    if (
      (!(filters.unity && filters.unity.length > 0) ||
        (filters.reserve && filters.reserve.length > 0)) &&
      enableReserve
    ) {
      reserveInvasions = await this.reserveInvasionRepository.listInvasions(
        filters
      )
    }

    if (
      (!(filters.reserve && filters.reserve.length > 0) ||
        (filters.unity && filters.unity.length > 0)) &&
      enableUnity
    ) {
      invasions = await this.invasionRepository.listInvasions(filters)
    }

    const results = invasions.concat(reserveInvasions)
    const sortedResults = results.sort((a, b) => {
      if (b.year > a.year) {
        return 1
      } else if (b.year < a.year) {
        return -1
      } else {
        if (b.process > a.process) {
          return 1
        } else if (b.process < a.process) {
          return -1
        }
        return 0
      }
    })

    return sortedResults
  }
}

export { ListInvasionsService }
