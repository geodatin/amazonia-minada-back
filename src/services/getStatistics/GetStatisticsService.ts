import { inject, injectable } from 'tsyringe'

import { IFiltersDTO } from '../../dtos/IFiltersDTO'
import { IInvasionDTO } from '../../dtos/IInvasionDTO'
import { IStatisticsDTO } from '../../dtos/IStatisticsDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import { groupInvasions } from '../../utils/group'
import {
  checkIfShouldListReserveInvasions,
  checkIfShouldListUnityInvasions,
} from '../../utils/listVerification'

@injectable()
class GetStatisticsService {
  constructor(
    @inject('ReserveInvasionRepository')
    private reserveInvasionRepository: IReserveInvasionRepository,

    @inject('InvasionRepository')
    private invasionRepository: IInvasionRepository
  ) {}

  async execute(filters: IFiltersDTO): Promise<IStatisticsDTO> {
    const statistics: IStatisticsDTO = {
      requirementsIncidence: {
        reserve: 0,
        unity: 0,
        total: 0,
      },
      requiredArea: {
        reserve: 0.0,
        unity: 0.0,
        total: 0.0,
      },
    }

    let reserveInvasions: IInvasionDTO[] = []
    let invasions: IInvasionDTO[] = []

    if (checkIfShouldListReserveInvasions(filters)) {
      reserveInvasions = await this.reserveInvasionRepository.listInvasions(
        filters
      )
      statistics.requirementsIncidence.reserve = reserveInvasions.length

      let sumArea = 0.0
      reserveInvasions.forEach((invasion) => (sumArea += invasion.area || 0))
      statistics.requiredArea.reserve = parseFloat(sumArea.toFixed(2))
    }

    if (checkIfShouldListUnityInvasions(filters)) {
      invasions = await this.invasionRepository.listInvasions(filters)
      statistics.requirementsIncidence.unity = invasions.length

      let sumArea = 0.0
      invasions.forEach((invasion) => (sumArea += invasion.area || 0))
      statistics.requiredArea.unity = parseFloat(sumArea.toFixed(2))
    }

    const groupedInvasions = groupInvasions(reserveInvasions, invasions)

    statistics.requirementsIncidence.total = groupedInvasions.length

    let sumArea = 0.0
    groupedInvasions.forEach((invasion) => (sumArea += invasion.area || 0))
    statistics.requiredArea.total = parseFloat(sumArea.toFixed(2))

    return statistics
  }
}

export { GetStatisticsService }
