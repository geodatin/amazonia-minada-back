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

    if (filters.unity) {
      match['properties.UC_NOME'] = {
        $in: filters.unity,
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

    const invasions = await Invasion.find(
      match,
      {
        company: '$properties.NOME',
        process: '$properties.PROCESSO',
        area: '$properties.AREA_HA',
        year: '$properties.ANO',
        state: '$properties.UF',
        territory: '$properties.UC_NOME',
        type: 'Unidade de Conservação',
        _id: 0,
      },
      { lean: true }
    )

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
            $sum:
              dataType === 'incidenceRequirements' ? 1 : '$properties.AREA_HA',
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
}

export { InvasionRepository }
