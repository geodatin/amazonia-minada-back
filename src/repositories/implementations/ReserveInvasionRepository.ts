import { ReserveInvasion } from '../../database/models/ReserveInvasion'
import { IFiltersDTO } from '../../dtos/IFiltersDTO'
import { IInvasionDTO } from '../../dtos/IInvasionDTO'
import { ISearchDTO } from '../../dtos/ISearchDTO'
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
      const acronymsRegex = filters.state
        .map((state) => getStateAcronym(state))
        .map((acronym) => new RegExp(`.*${acronym}.*`, 'i'))
      match['properties.UF'] = {
        $in: acronymsRegex,
      }
    }

    const invasions = await ReserveInvasion.find(match, {
      company: '$properties.NOME',
      process: '$properties.PROCESSO',
      area: '$properties.AREA_HA',
      year: '$properties.ANO',
      state: '$properties.UF',
      territory: '$properties.TI_NOME',
      type: 'Terra Indígena',
      _id: 0,
    })

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
}

export { ReserveInvasionRepository }
