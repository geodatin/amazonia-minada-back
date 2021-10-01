import { inject, injectable } from 'tsyringe'

import { IRequestRankingDTO, IResponseRankingDTO } from '../../dtos/IRankingDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import {
  checkIfShouldListReserveInvasions,
  checkIfShouldListUnityInvasions,
} from '../../utils/listVerification'
import { paginate } from '../../utils/pagination'
import { getStateFromAcronym } from '../../utils/states'

@injectable()
class InvasionRankingService {
  constructor(
    @inject('ReserveInvasionRepository')
    private reserveInvasionRepository: IReserveInvasionRepository,
    @inject('InvasionRepository')
    private invasionRepository: IInvasionRepository
  ) {}

  async execute({
    propertyType,
    page,
    dataType,
    sortOrder,
    filters,
  }: IRequestRankingDTO) {
    if (propertyType === 'state' || propertyType === 'company') {
      let reserveResults: IResponseRankingDTO[] = []
      if (checkIfShouldListReserveInvasions(filters)) {
        reserveResults =
          await this.reserveInvasionRepository.reserveInvasionRanking({
            propertyType,
            page,
            dataType,
            sortOrder,
            filters,
          })
      }

      let invasionResults: IResponseRankingDTO[] = []
      if (checkIfShouldListUnityInvasions(filters)) {
        invasionResults = await this.invasionRepository.invasionRanking({
          propertyType,
          page,
          dataType,
          sortOrder,
          filters,
        })
      }

      if (reserveResults.length === 0 && invasionResults.length === 0) {
        return null
      } else if (reserveResults.length === 0) {
        return this.formatSingleRanking(
          invasionResults,
          page,
          dataType,
          'protectedArea',
          propertyType
        )
      } else if (invasionResults.length === 0) {
        return this.formatSingleRanking(
          reserveResults,
          page,
          dataType,
          'indigenousLand',
          propertyType
        )
      }

      return this.formatDoubleRanking(
        invasionResults,
        reserveResults,
        dataType,
        propertyType,
        sortOrder,
        page
      )
    } else if (propertyType === 'unity') {
      if (checkIfShouldListUnityInvasions(filters)) {
        const results = await this.invasionRepository.invasionRanking({
          propertyType,
          page,
          dataType,
          sortOrder,
          filters,
        })

        if (results.length === 0) {
          return null
        }

        return this.formatSingleRanking(
          results,
          page,
          dataType,
          'protectedArea',
          propertyType
        )
      }
      return null
    } else if (propertyType === 'reserve') {
      if (checkIfShouldListReserveInvasions(filters)) {
        const results =
          await this.reserveInvasionRepository.reserveInvasionRanking({
            propertyType,
            page,
            dataType,
            sortOrder,
            filters,
          })
        if (results.length === 0) {
          return null
        }
        return this.formatSingleRanking(
          results,
          page,
          dataType,
          'indigenousLand',
          propertyType
        )
      }
      return null
    } else if (propertyType === 'ethnicity') {
      if (checkIfShouldListReserveInvasions(filters)) {
        const results = await this.reserveInvasionRepository.ethnicityRanking(
          dataType,
          sortOrder,
          filters
        )
        if (results.length === 0) {
          return null
        }
        return this.formatSingleRanking(
          results,
          page,
          dataType,
          'indigenousLand',
          propertyType
        )
      }
      return null
    }
  }

  formatSingleRanking(
    results: IResponseRankingDTO[],
    page = 1,
    dataType: string,
    id: string,
    propertyType: string
  ) {
    const x: string[] = []
    const y: number[] = []
    const pos: number[] = []
    results.forEach((invasion, i) => {
      if (propertyType === 'state') {
        x.push(getStateFromAcronym(invasion.x))
      } else {
        x.push(invasion.x)
      }
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

  formatDoubleRanking(
    invasionResults: IResponseRankingDTO[],
    reserveResults: IResponseRankingDTO[],
    dataType: string,
    propertyType: string,
    sortOrder: string,
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
        if (sortOrder === 'ASC') {
          return a.total - b.total
        }
        return b.total - a.total
      })
      .forEach((element, i) => {
        if (propertyType === 'state') {
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

export { InvasionRankingService }
