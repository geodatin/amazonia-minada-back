import { ReserveInvasion } from '../../database/models/ReserveInvasion'
import { IFiltersDTO } from '../../dtos/IFiltersDTO'
import { IInvasionDTO } from '../../dtos/IInvasionDTO'
import { IRequestRankingDTO, IResponseRankingDTO } from '../../dtos/IRankingDTO'
import { ISearchDTO } from '../../dtos/ISearchDTO'
import { rankingFilter } from '../../utils/rankingFilter'
import { getStateAcronym } from '../../utils/states'
import { IReserveInvasionRepository } from '../IReserveInvasionRepository'

class ReserveInvasionRepository implements IReserveInvasionRepository {
  async listInvasions(filters: IFiltersDTO): Promise<IInvasionDTO[]> {
    const match: any = {}

    if (filters.reserve) {
      match['properties.TI_NOME'] = {
        $in: filters.reserve,
      }
    }

    if (filters.company) {
      match['properties.NOME'] = {
        $in: filters.company,
      }
    }

    if (filters.year) {
      match['properties.ANO'] = {
        $in: filters.year,
      }
    }

    if (filters.state) {
      const acronymsRegex = filters.state.map(
        (state) => new RegExp(`.*${getStateAcronym(state)}.*`, 'i')
      )
      match['properties.UF'] = {
        $in: acronymsRegex,
      }
    }

    const invasions = await ReserveInvasion.find(
      match,
      {
        company: '$properties.NOME',
        process: '$properties.PROCESSO',
        area: '$properties.AREA_HA',
        year: '$properties.ANO',
        state: '$properties.UF',
        territory: '$properties.TI_NOME',
        type: 'Terra Indígena',
        _id: 0,
      },
      { lean: true }
    )

    return invasions
  }

  async searchCompany(searchTerm: string): Promise<ISearchDTO[]> {
    const companies = await ReserveInvasion.aggregate([
      {
        $match: {
          'properties.NOME': { $regex: new RegExp(`^${searchTerm}`, 'i') },
        },
      },
      {
        $group: {
          _id: '$properties.NOME',
        },
      },
      {
        $project: {
          type: 'company',
          value: '$_id',
          _id: 0,
        },
      },
    ])
    return companies
  }

  async reserveInvasionRanking({
    territoryType,
    dataType,
  }: IRequestRankingDTO): Promise<IResponseRankingDTO[]> {
    const propertie = rankingFilter[territoryType]
    let aggregation
    if (dataType === 'frequency') {
      aggregation = 1
    } else if (dataType === 'value') {
      aggregation = '$properties.AREA_HA'
    }
    const territories = await ReserveInvasion.aggregate([
      {
        $group: {
          _id: propertie,
          count: { $sum: aggregation },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          x: '$_id',
          y: '$count',
          _id: 0,
        },
      },
    ])

    return territories
  }
}

export { ReserveInvasionRepository }
