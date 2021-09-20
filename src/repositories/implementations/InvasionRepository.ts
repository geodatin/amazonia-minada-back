import { Invasion } from '../../database/models/Invasion'
import { IFiltersDTO } from '../../dtos/IFiltersDTO'
import { IInvasionDTO } from '../../dtos/IInvasionDTO'
import { IRequestRankingDTO, IResponseRankingDTO } from '../../dtos/IRankingDTO'
import { ISearchDTO } from '../../dtos/ISearchDTO'
import { rankingFilter } from '../../utils/rankingFilter'
import { getStateAcronym } from '../../utils/states'
import { IInvasionRepository } from '../IInvasionRepository'

class InvasionRepository implements IInvasionRepository {
  async listInvasions(filters: IFiltersDTO): Promise<IInvasionDTO[]> {
    const match: any = {}

    if (filters.unity && filters.unity.length > 0) {
      match['properties.UC_NOME'] = {
        $in: filters.unity,
      }
    }

    if (filters.company && filters.company.length > 0) {
      match['properties.NOME'] = {
        $in: filters.company,
      }
    }

    if (filters.year && filters.year.length > 0) {
      match['properties.ANO'] = {
        $in: filters.year,
      }
    }

    if (filters.state && filters.state.length > 0) {
      const acronymsRegex = filters.state.map(
        (state) => new RegExp(`.*${getStateAcronym(state)}.*`, 'i')
      )
      match['properties.UF'] = {
        $in: acronymsRegex,
      }
    }

    if (filters.substance && filters.substance.length > 0) {
      match['properties.SUBS'] = {
        $in: filters.substance,
      }
    }

    const invasions = await Invasion.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$properties.PROCESSO',
          company: { $first: '$properties.NOME' },
          area: { $sum: '$properties.AREA_HA' },
          year: { $first: '$properties.ANO' },
          state: { $first: '$properties.UF' },
          territory: { $first: '$properties.UC_NOME' },
          miningProcess: { $first: '$properties.FASE' },
          substance: { $first: '$properties.SUBS' },
        },
      },
      {
        $project: {
          company: '$company',
          process: '$_id',
          area: '$area',
          year: '$year',
          state: '$state',
          miningProcess: '$miningProcess',
          territory: '$territory',
          type: 'protectedArea',
          substance: '$substance',
          _id: 0,
        },
      },
    ])

    return invasions
  }
  async searchCompany(searchTerm: string): Promise<ISearchDTO[]> {
    const companies = await Invasion.aggregate([
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

  async invasionRanking({
    territoryType,
    dataType,
  }: IRequestRankingDTO): Promise<IResponseRankingDTO[]> {
    const propertie = rankingFilter[territoryType]
    const territories = await Invasion.aggregate([
      {
        $group: {
          _id: propertie,
          count: {
            $sum: dataType === 'requiredArea' ? '$properties.AREA_HA' : 1,
          },
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

  async getRequirementsPhase(): Promise<String[]> {
    const requirementsPhase = await Invasion.distinct('properties.FASE')
    return requirementsPhase
  }
}

export { InvasionRepository }
