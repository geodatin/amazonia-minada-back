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
          id: '$properties.ID',
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
        $project: {
          _id: 0,
          key: '$_id',
          id: '$properties.ID',
          company: '$properties.NOME',
          process: '$properties.PROCESSO',
          area: '$properties.AREA_HA',
          year: '$properties.ANO',
          state: {
            $split: ['$properties.UF', '/'],
          },
          miningProcess: '$properties.FASE',
          territory: {
            $split: ['$properties.UC_NOME', ', '],
          },
          substance: '$properties.SUBS',
          use: '$properties.USO',
          lastEvent: '$properties.ULT_EVENTO',
        },
      },
      { $unwind: '$state' },
      { $unwind: '$territory' },
      {
        $group: {
          _id: '$id',
          key: { $first: '$key' },
          company: { $first: '$company' },
          process: { $first: '$process' },
          area: { $first: '$area' },
          year: { $first: '$year' },
          state: { $addToSet: '$state' },
          miningProcess: { $first: '$miningProcess' },
          territory: { $addToSet: '$territory' },
          substance: { $first: '$substance' },
          use: { $first: '$use' },
          lastEvent: { $first: '$lastEvent' },
        },
      },
      {
        $project: {
          _id: 0,
          key: '$key',
          id: '$_id',
          company: '$company',
          process: '$process',
          area: '$area',
          year: '$year',
          state: {
            $reduce: {
              input: '$state',
              initialValue: '',
              in: {
                $concat: [
                  '$$value',
                  {
                    $cond: {
                      if: {
                        $eq: ['$$value', ''],
                      },
                      then: '',
                      else: ', ',
                    },
                  },
                  '$$this',
                ],
              },
            },
          },
          miningProcess: '$miningProcess',
          territory: {
            $reduce: {
              input: '$territory',
              initialValue: '',
              in: {
                $concat: [
                  '$$value',
                  {
                    $cond: {
                      if: {
                        $eq: ['$$value', ''],
                      },
                      then: '',
                      else: ', ',
                    },
                  },
                  '$$this',
                ],
              },
            },
          },
          type: 'protectedArea',
          substance: '$substance',
          use: '$use',
          lastEvent: '$lastEvent',
        },
      },
      { $sort: { year: -1, id: 1 } },
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

    let aggregations
    if (propertyType === 'unity') {
      aggregations = [
        { $match: match },
        {
          $project: {
            id: '$properties.ID',
            unity: {
              $split: ['$properties.UC_NOME', ', '],
            },
            area: '$properties.AREA_HA',
          },
        },
        { $unwind: '$unity' },
        {
          $group: {
            _id: '$id',
            unity: { $addToSet: '$unity' },
          },
        },
        { $unwind: '$unity' },
        {
          $group: {
            _id: property,
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
      ]
    } else if (propertyType === 'state') {
      aggregations = [
        { $match: match },
        {
          $project: {
            id: '$properties.ID',
            state: {
              $split: ['$properties.UF', '/'],
            },
            area: '$properties.AREA_HA',
          },
        },
        { $unwind: '$state' },
        {
          $group: {
            _id: '$id',
            state: { $addToSet: '$state' },
          },
        },
        { $unwind: '$state' },
        {
          $group: {
            _id: property,
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
      ]
    } else {
      aggregations = [
        { $match: match },
        {
          $project: {
            id: '$properties.ID',
            company: '$properties.NOME',
            requirementPhase: '$properties.FASE',
            substance: '$properties.SUBS',
            use: '$properties.USO',
            area: '$properties.AREA_HA',
          },
        },
        {
          $group: {
            _id: '$id',
            company: { $first: '$company' },
            area: { $first: '$area' },
            requirementPhase: { $first: '$requirementPhase' },
            substance: { $first: '$substance' },
            use: { $first: '$use' },
          },
        },
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
      ]
    }

    const ranking = await Invasion.aggregate(aggregations)
    return ranking
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

  async getUses(): Promise<ISearchDTO[]> {
    const uses = await Invasion.aggregate([
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

  private getMatchProperty(filters: IFiltersDTO) {
    const match: any = {
      // eslint-disable-next-line camelcase
      last_action: {
        $ne: 'delete',
      },
    }

    if (filters?.unity && filters?.unity?.length > 0) {
      match['properties.UC_NOME'] = {
        $in: filters.unity,
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

export { InvasionRepository }
