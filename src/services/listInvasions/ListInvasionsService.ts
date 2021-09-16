import { inject, injectable } from 'tsyringe'

import { IFiltersDTO } from '../../dtos/IFiltersDTO'
import { IInvasionDTO } from '../../dtos/IInvasionDTO'
import { IPaginationDTO } from '../../dtos/IPaginationDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import { paginate } from '../../utils/pagination'

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
    enableReserve: boolean = true,
    page: number = 1,
    pageSize: number = 10
  ): Promise<IPaginationDTO> {
    let reserveInvasions: IInvasionDTO[] = []
    let invasions: IInvasionDTO[] = []

    if (
      ((!filters.reserve && !filters.unity) || filters.reserve) &&
      enableReserve
    ) {
      reserveInvasions = await this.reserveInvasionRepository.listInvasions(
        filters
      )
    }

    if (
      ((!filters.reserve && !filters.unity) || filters.unity) &&
      enableUnity
    ) {
      invasions = await this.invasionRepository.listInvasions(filters)
    }

    const results = invasions.concat(reserveInvasions)
    const sortedResults = results.sort((a, b) => {
      return b.year - a.year
    })

    return paginate(sortedResults, page, pageSize)
  }
}

export { ListInvasionsService }
