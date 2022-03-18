import { inject, injectable } from 'tsyringe'

import { IRequestRankingDTO, IResponseRankingDTO } from '../../dtos/IRankingDTO'
import { AppError } from '../../errors/AppError'
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

  async execute(
    { propertyType, page, dataType, sortOrder, filters }: IRequestRankingDTO,
    enableUnity: boolean = true,
    enableReserve: boolean = true
  ) {
    if (
      propertyType === 'state' ||
      propertyType === 'company' ||
      propertyType === 'substance' ||
      propertyType === 'requirementPhase' ||
      propertyType === 'use'
    ) {
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

      if (
        (reserveResults.length === 0 && invasionResults.length === 0) ||
        (!enableUnity && !enableReserve)
      ) {
        return null
      } else if (reserveResults.length === 0 || !enableReserve) {
        return this.formatSingleRanking(
          invasionResults,
          page,
          dataType,
          'protectedArea',
          propertyType
        )
      } else if (invasionResults.length === 0 || !enableUnity) {
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
    throw new AppError('Invalid property type: ' + propertyType)
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
    const rankingValues = new Map<string, any>()
    invasionResults.forEach((invasion) => {
      rankingValues.set(invasion.x, {
        name: invasion.x,
        invasionValue: invasion.y,
      })
    })
    reserveResults.forEach((reserveInvasion) => {
      if (rankingValues.has(reserveInvasion.x)) {
        const obj = rankingValues.get(reserveInvasion.x)
        rankingValues.set(reserveInvasion.x, {
          name: reserveInvasion.x,
          reserveValue: reserveInvasion.y,
          invasionValue: obj.invasionValue,
        })
      } else {
        rankingValues.set(reserveInvasion.x, {
          name: reserveInvasion.x,
          reserveValue: reserveInvasion.y,
        })
      }
    })

    const newRanking = Array.from(rankingValues.values())
      .map((entry) => {
        return {
          name: entry.name,
          reserveValue: entry.reserveValue ?? 0,
          invasionValue: entry.invasionValue ?? 0,
          total: (entry.reserveValue ?? 0) + (entry.invasionValue ?? 0),
        }
      })
      .sort((a, b) => {
        if (sortOrder === 'ASC') {
          return a.total - b.total
        }
        return b.total - a.total
      })

    const pagination = paginate(newRanking, page, 5)

    const x: string[] = []
    const invasionY: number[] = []
    const reserveY: number[] = []
    const pos: number[] = []

    pagination.values.forEach((element, i) => {
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
      x: x,
      position: pos,
      series: [
        {
          id: 'protectedArea',
          data: invasionY,
        },
        {
          id: 'indigenousLand',
          data: reserveY,
        },
      ],
      pageAmount: pagination.pages,
      dataType,
    }
  }
}

export { InvasionRankingService }
