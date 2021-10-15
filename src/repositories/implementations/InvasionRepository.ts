import { Invasion } from '../../database/models/Invasion'
import { IFiltersDTO } from '../../dtos/IFiltersDTO'
import { IInvasionDTO } from '../../dtos/IInvasionDTO'
import { IRequestRankingDTO, IResponseRankingDTO } from '../../dtos/IRankingDTO'
import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IShapeDTO } from '../../dtos/IShapeDTO'
import { rankingFilter } from '../../utils/rankingFilter'
import { getStateAcronym } from '../../utils/states'
import { IInvasionRepository } from '../IInvasionRepository'

class InvasionRepository implements IInvasionRepository {
  async getShape(filters: IFiltersDTO): Promise<IShapeDTO[]> {
    const match = this.getMatchProperty(filters)
    const invasions: IShapeDTO[] = await Invasion.aggregate([
      { $match: match },
      {
        $project: {
          _id: 0,
          company: '$properties.NOME',
          process: '$properties.PROCESSO',
          area: '$properties.AREA_HA',
          year: '$properties.ANO',
          state: '$properties.UF',
          miningProcess: '$properties.FASE',
          territory: '$properties.UC_NOME',
          type: 'protectedArea',
          substance: '$properties.SUBS',
          use: '$properties.USO',
          lastEvent: '$properties.ULT_EVENTO',
          geometry: '$geometry',
        },
      },
    ])
    return invasions
  }

  async listInvasions(filters: IFiltersDTO): Promise<IInvasionDTO[]> {
    const match = this.getMatchProperty(filters)

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
          use: { $first: '$properties.USO' },
          lastEvent: { $first: '$properties.ULT_EVENTO' },
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
          use: '$use',
          lastEvent: '$lastEvent',
          _id: 0,
        },
      },
      { $sort: { year: -1, process: 1 } },
    ])

    return invasions
  }
  async searchCompany(searchTerm: string): Promise<ISearchDTO[]> {
    const companies = await Invasion.aggregate([
      {
        $match: {
          'properties.NOME': {
            $regex: new RegExp(`^${searchTerm}|.* ${searchTerm}.*`, 'i'),
            $ne: 'DADO NÃO CADASTRADO',
          },
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

  async searchSubstance(searchTerm: string): Promise<ISearchDTO[]> {
    const substances = await Invasion.aggregate([
      {
        $match: {
          'properties.SUBS': {
            $regex: new RegExp(`^${searchTerm}|.* ${searchTerm}.*`, 'i'),
            $ne: 'DADO NÃO CADASTRADO',
          },
        },
      },
      {
        $group: {
          _id: '$properties.SUBS',
        },
      },
      {
        $project: {
          type: 'substance',
          value: '$_id',
          _id: 0,
        },
      },
    ])
    return substances
  }

  async invasionRanking({
    propertyType,
    dataType,
    sortOrder,
    filters,
  }: IRequestRankingDTO): Promise<IResponseRankingDTO[]> {
    const property = rankingFilter[propertyType]
    const match = this.getMatchProperty(filters)

    if (dataType === 'requiredArea') {
      match['properties.AREA_HA'] = {
        $ne: NaN,
      }
    }

    const territories = await Invasion.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$properties.PROCESSO',
          AREA_HA: { $sum: '$properties.AREA_HA' },
          UF: { $first: '$properties.UF' },
          UC_NOME: { $first: '$properties.UC_NOME' },
          NOME: { $first: '$properties.NOME' },
        },
      },
      {
        $group: {
          _id: property,
          count: {
            $sum: dataType === 'requiredArea' ? '$AREA_HA' : 1,
          },
        },
      },
      { $sort: { count: sortOrder === 'ASC' ? 1 : -1 } },
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

  async getYears(): Promise<ISearchDTO[]> {
    const years = await Invasion.aggregate([
      {
        $group: {
          _id: '$properties.ANO',
        },
      },
      {
        $project: {
          type: 'year',
          value: '$_id',
          _id: 0,
        },
      },
    ])
    return years
  }

  private getMatchProperty(filters: IFiltersDTO) {
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

    if (filters.requirementPhase && filters.requirementPhase.length > 0) {
      match['properties.FASE'] = {
        $in: filters.requirementPhase,
      }
    }

    return match
  }

  async getRequirementsPhase(): Promise<ISearchDTO[]> {
    const requirementsPhase = await Invasion.aggregate([
      {
        $match: {
          'properties.FASE': {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: '$properties.FASE',
        },
      },
      {
        $project: {
          type: 'requirementPhase',
          value: '$_id',
          _id: 0,
        },
      },
    ])
    return requirementsPhase
  }
}

export { InvasionRepository }
