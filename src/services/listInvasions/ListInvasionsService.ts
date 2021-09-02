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

  async execute(filters: IFiltersDTO): Promise<IInvasionDTO[]> {
    let reserveInvasions: IInvasionDTO[] = []
    let invasions: IInvasionDTO[] = []

    if ((!filters.reserve && !filters.unity) || filters.reserve) {
      reserveInvasions = await this.reserveInvasionRepository.listInvasions(
        filters
      )
    }

    if ((!filters.reserve && !filters.unity) || filters.unity) {
      invasions = await this.invasionRepository.listInvasions(filters)
    }

    const results = invasions.concat(reserveInvasions)

    return results
  }
}

export { ListInvasionsService }
