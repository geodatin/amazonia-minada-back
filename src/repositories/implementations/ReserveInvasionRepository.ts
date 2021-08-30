import { ReserveInvasion } from '../../database/models/ReserveInvasion'
import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IReserveInvasionRepository } from '../IReserveInvasionRepository'

class ReserveInvasionRepository implements IReserveInvasionRepository {
  async searchCompany(searchTerm: string): Promise<ISearchDTO[]> {
    const companies = await ReserveInvasion.aggregate([
      {
        $match: {
          'properties.NOME': { $regex: new RegExp(`^${searchTerm}`, 'i') },
        },
      },
      {
        $project: { name: { $toUpper: '$properties.NOME' } },
      },
      {
        $group: {
          _id: '$name',
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
