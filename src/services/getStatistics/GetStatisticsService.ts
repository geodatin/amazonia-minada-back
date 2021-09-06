import { inject, injectable } from 'tsyringe'

import { IFiltersDTO } from '../../dtos/IFiltersDTO'
import { IStatisticsDTO } from '../../dtos/IStatisticsDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'

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

    if ((!filters.reserve && !filters.unity) || filters.reserve) {
      const reserveInvasions =
        await this.reserveInvasionRepository.listInvasions(filters)
      statistics.requirementsIncidence.reserve = reserveInvasions.length

      let sumArea = 0.0
      reserveInvasions.forEach((invasion) => (sumArea += invasion.area || 0))
      statistics.requiredArea.reserve = parseFloat(sumArea.toFixed(2))
    }

    if ((!filters.reserve && !filters.unity) || filters.unity) {
      const invasions = await this.invasionRepository.listInvasions(filters)
      statistics.requirementsIncidence.unity = invasions.length

      let sumArea = 0.0
      invasions.forEach((invasion) => (sumArea += invasion.area || 0))
      statistics.requiredArea.unity = parseFloat(sumArea.toFixed(2))
    }

    statistics.requirementsIncidence.total =
      statistics.requirementsIncidence.reserve +
      statistics.requirementsIncidence.unity

    statistics.requiredArea.total =
      statistics.requiredArea.reserve + statistics.requiredArea.unity

    return statistics
  }
}

export { GetStatisticsService }
