import { inject, injectable } from 'tsyringe'

import { IRequestRankingDTO, IResponseRankingDTO } from '../../dtos/IRankingDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import { paginate } from '../../utils/pagination'
import { getStateFromAcronym } from '../../utils/states'

@injectable()
class InvasionFrequencyService {
  constructor(
    @inject('ReserveInvasionRepository')
    private reserveInvasionRepository: IReserveInvasionRepository,
    @inject('InvasionRepository')
    private invasionRepository: IInvasionRepository
  ) {}

  async execute({
    territoryType,
    page,
    dataType,
    filters,
  }: IRequestRankingDTO) {
    if (territoryType === 'state' || territoryType === 'company') {
      const reserveResults =
        await this.reserveInvasionRepository.reserveInvasionRanking({
          territoryType,
          page,
          dataType,
          filters,
        })
      const invasionResults = await this.invasionRepository.invasionRanking({
        territoryType,
        page,
        dataType,
        filters,
      })
      return await this.formatDoubleRanking(
        reserveResults,
        invasionResults,
        dataType,
        territoryType,
        page
      )
    } else if (territoryType === 'unity') {
      const results = await this.invasionRepository.invasionRanking({
        territoryType,
        page,
        dataType,
        filters,
      })
      return await this.formatSingleRanking(
        results,
        page,
        dataType,
        'protectedArea'
      )
    } else if (territoryType === 'reserve') {
      const results =
        await this.reserveInvasionRepository.reserveInvasionRanking({
          territoryType,
          page,
          dataType,
          filters,
        })
      return await this.formatSingleRanking(
        results,
        page,
        dataType,
        'indigenousLand'
      )
    }
  }

  async formatSingleRanking(
    results: IResponseRankingDTO[],
    page = 1,
    dataType: string,
    id: string
  ) {
    const x: string[] = []
    const y: number[] = []
    const pos: number[] = []
    results.forEach((invasion, i) => {
      x.push(invasion.x)
      y.push(invasion.y)
      pos.push(i + 1)
    })
    return {
      x: paginate(x, page, 5).values,
      position: paginate(pos, page, 5).values,
      series: [{ id, data: paginate(y, page, 5).values }],
      pageAmount: paginate(pos, page, 5).pages,
      dataType,
    }
  }

  async formatDoubleRanking(
    invasionResults: IResponseRankingDTO[],
    reserveResults: IResponseRankingDTO[],
    dataType: string,
    territoryType: string,
    page = 1
  ) {
    const x: string[] = []
    const invasionY: number[] = []
    const reserveY: number[] = []
    const newRanking: any[] = []
    const pos: number[] = []
    invasionResults.forEach((invasion) => {
      const reserve = reserveResults.find((reserve) => reserve.x === invasion.x)
      newRanking.push({
        name: invasion.x,
        invasionValue: invasion.y,
        reserveValue: reserve?.y || 0,
        total: (reserve?.y || 0) + invasion.y,
      })
    })
    newRanking
      .sort((a, b) => {
        if (a.total > b.total) return -1
        if (a.total < b.total) return 1
        return 0
      })
      .forEach((element, i) => {
        if (territoryType === 'state') {
          x.push(getStateFromAcronym(element.name))
        } else {
          x.push(element.name)
        }
        invasionY.push(element.invasionValue)
        reserveY.push(element.reserveValue)
        pos.push(i + 1)
      })
    return {
      x: paginate(x, page, 5).values,
      position: paginate(pos, page, 5).values,
      series: [
        {
          id: 'indigenousLand',
          data: paginate(invasionY, page, 5).values,
        },
        {
          id: 'protectedArea',
          data: paginate(reserveY, page, 5).values,
        },
      ],
      pageAmount: paginate(pos, page, 5).pages,
      dataType,
    }
  }
}

export { InvasionFrequencyService }
