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
    const match = await this.getMatchProperty(filters)

    const invasions = await ReserveInvasion.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$properties.PROCESSO',
          company: { $first: '$properties.NOME' },
          area: { $sum: '$properties.AREA_HA' },
          year: { $first: '$properties.ANO' },
          state: { $first: '$properties.UF' },
          territory: { $first: '$properties.TI_NOME' },
          reservePhase: { $first: '$properties.TI_FASE' },
          reserveEthnicity: { $first: '$properties.TI_ETNIA' },
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
          reservePhase: '$reservePhase',
          reserveEthnicity: '$reserveEthnicity',
          type: 'indigenousLand',
          substance: '$substance',
          _id: 0,
        },
      },
    ])

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
    filters,
  }: IRequestRankingDTO): Promise<IResponseRankingDTO[]> {
    const propertie = rankingFilter[territoryType]
    const match = await this.getMatchProperty(filters)
    const territories = await ReserveInvasion.aggregate([
      { $match: match },
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

  private async getMatchProperty(filters: IFiltersDTO) {
    const match: any = {}

    if (filters.reserve && filters.reserve.length > 0) {
      match['properties.TI_NOME'] = {
        $in: filters.reserve,
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

    if (filters.reservePhase && filters.reservePhase.length > 0) {
      match['properties.TI_FASE'] = {
        $in: filters.reservePhase,
      }
    }

    if (filters.reserveEthnicity && filters.reserveEthnicity.length > 0) {
      const ethnicitiesRegex = filters.reserveEthnicity.map(
        (ethnicity) => new RegExp(`.*${ethnicity}.*`, 'i')
      )
      match['properties.TI_ETNIA'] = {
        $in: ethnicitiesRegex,
      }
    }

    if (filters.requirementPhase && filters.requirementPhase.length > 0) {
      match['properties.FASE'] = {
        $in: filters.requirementPhase,
      }
    }

    return match
  }

  async getRequirementsPhase(): Promise<String[]> {
    const requirementsPhase = await ReserveInvasion.distinct('properties.FASE')
    return requirementsPhase
  }
}

export { ReserveInvasionRepository }
