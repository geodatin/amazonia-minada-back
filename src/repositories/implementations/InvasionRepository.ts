import { Invasion } from '../../database/models/Invasion'
import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IInvasionRepository } from '../IInvasionRepository'

class InvasionRepository implements IInvasionRepository {
  async searchCompany(searchTerm: string): Promise<ISearchDTO[]> {
    const companies = await Invasion.aggregate([
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

export { InvasionRepository }
