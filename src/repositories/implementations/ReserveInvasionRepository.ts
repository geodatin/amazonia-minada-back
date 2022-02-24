import { ReserveInvasion } from '../../database/models/ReserveInvasion'
import { IFiltersDTO } from '../../dtos/IFiltersDTO'
import { IInvasionDTO } from '../../dtos/IInvasionDTO'
import { IRequestRankingDTO, IResponseRankingDTO } from '../../dtos/IRankingDTO'
import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IShapeDTO } from '../../dtos/IShapeDTO'
import { rankingFilter } from '../../utils/rankingFilter'
import { getStateAcronym } from '../../utils/states'
import { IReserveInvasionRepository } from '../IReserveInvasionRepository'

class ReserveInvasionRepository implements IReserveInvasionRepository {
  async getShape(filters: IFiltersDTO): Promise<IShapeDTO[]> {
    const match = this.getMatchProperty(filters)
    const invasions: IShapeDTO[] = await ReserveInvasion.aggregate([
      { $match: match },
      {
        $project: {
          _id: 0,
          id: '$properties.ID',
          company: '$properties.NOME',
          process: '$properties.PROCESSO',
          area: '$properties.AREA_HA',
          year: '$properties.ANO',
          state: '$properties.UF',
          miningProcess: '$properties.FASE',
          territory: '$properties.TI_NOME',
          reservePhase: '$properties.TI_FASE',
          reserveEthnicity: '$properties.TI_ETNIA',
          type: 'indigenousLand',
          substance: '$properties.SUBS',
          use: '$properties.USO',
          lastEvent: '$properties.ULT_EVENTO',
          geometry: '$geometry',
        },
      },
    ])
    return invasions
  }

  async searchSubstance(searchTerm: string): Promise<ISearchDTO[]> {
    const substances = await ReserveInvasion.aggregate([
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

  async listInvasions(filters: IFiltersDTO): Promise<IInvasionDTO[]> {
    const match = this.getMatchProperty(filters)

    const invasions = await ReserveInvasion.aggregate([
      { $match: match },
      {
        $project: {
          _id: 0,
          key: '$_id',
          id: '$properties.ID',
          company: '$properties.NOME',
          process: '$properties.PROCESSO',
          area: '$properties.AREA_HA',
          year: '$properties.ANO',
          state: '$properties.UF',
          miningProcess: '$properties.FASE',
          territory: '$properties.TI_NOME',
          reservePhase: '$properties.TI_FASE',
          reserveEthnicity: '$properties.TI_ETNIA',
          type: 'indigenousLand',
          substance: '$properties.SUBS',
          use: '$properties.USO',
          lastEvent: '$properties.ULT_EVENTO',
        },
      },
      { $sort: { year: -1, id: 1 } },
    ])

    return invasions
  }

  async searchCompany(searchTerm: string): Promise<ISearchDTO[]> {
    const companies = await ReserveInvasion.aggregate([
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

  async ethnicityRanking(
    dataType: string,
    sortOrder: string,
    filters: IFiltersDTO
  ): Promise<IResponseRankingDTO[]> {
    const match = this.getMatchProperty(filters)

    if (dataType === 'requiredArea') {
      match['properties.AREA_HA'] = {
        $ne: NaN,
      }
    }

    const ethnicities = await ReserveInvasion.aggregate([
      { $match: match },
      {
        $project: {
          ethnicity: {
            $split: ['$properties.TI_ETNIA', ', '],
          },
          area: '$properties.AREA_HA',
        },
      },
      { $unwind: '$ethnicity' },
      {
        $project: {
          ethnicity: { $trim: { input: '$ethnicity' } },
          area: 1,
        },
      },
      {
        $group: {
          _id: '$ethnicity',
          count: {
            $sum: dataType === 'requiredArea' ? '$area' : 1,
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
    return ethnicities
  }

  async reserveInvasionRanking({
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

    const territories = await ReserveInvasion.aggregate([
      { $match: match },
      {
        $group: {
          _id: property,
          count: {
            $sum: dataType === 'requiredArea' ? '$properties.AREA_HA' : 1,
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
    const years = await ReserveInvasion.aggregate([
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

  async getUses(): Promise<ISearchDTO[]> {
    const uses = await ReserveInvasion.aggregate([
      {
        $match: {
          'properties.USO': {
            $ne: 'DADO NÃO CADASTRADO',
          },
        },
      },
      {
        $group: {
          _id: '$properties.USO',
        },
      },
      {
        $project: {
          type: 'use',
          value: '$_id',
          _id: 0,
        },
      },
    ])

    return uses
  }

  async getRequirementsPhase(): Promise<ISearchDTO[]> {
    const requirementsPhase = await ReserveInvasion.aggregate([
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

  private getMatchProperty(filters: IFiltersDTO) {
    const match: any = {
      // eslint-disable-next-line camelcase
      last_action: {
        $ne: 'delete',
      },
    }

    if (filters?.reserve && filters?.reserve?.length > 0) {
      match['properties.TI_NOME'] = {
        $in: filters.reserve,
      }
    }

    if (filters?.company && filters?.company?.length > 0) {
      match['properties.NOME'] = {
        $in: filters.company,
      }
    }

    if (filters?.year && filters?.year?.length > 0) {
      match['properties.ANO'] = {
        $in: filters.year,
      }
    }

    if (filters?.state && filters?.state?.length > 0) {
      const acronymsRegex = filters.state.map(
        (state) => new RegExp(`.*${getStateAcronym(state)}.*`, 'i')
      )
      match['properties.UF'] = {
        $in: acronymsRegex,
      }
    }

    if (filters?.substance && filters?.substance?.length > 0) {
      match['properties.SUBS'] = {
        $in: filters.substance,
      }
    }

    if (filters?.reservePhase && filters?.reservePhase?.length > 0) {
      match['properties.TI_FASE'] = {
        $in: filters.reservePhase,
      }
    }

    if (filters?.reserveEthnicity && filters?.reserveEthnicity?.length > 0) {
      const ethnicitiesRegex = filters.reserveEthnicity.map(
        (ethnicity) => new RegExp(`.*${ethnicity}.*`, 'i')
      )
      match['properties.TI_ETNIA'] = {
        $in: ethnicitiesRegex,
      }
    }

    if (filters?.requirementPhase && filters?.requirementPhase?.length > 0) {
      match['properties.FASE'] = {
        $in: filters.requirementPhase,
      }
    }

    if (filters?.use && filters?.use?.length > 0) {
      match['properties.USO'] = {
        $in: filters.use,
      }
    }

    return match
  }
}

export { ReserveInvasionRepository }
