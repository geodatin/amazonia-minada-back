import { Reserve } from '../../database/models/Reserve'
import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IReserveRepository } from '../IReserveRepository'

class ReserveRepository implements IReserveRepository {
  async searchByName(searchTerm: string): Promise<ISearchDTO[]> {
    const reserves = await Reserve.find(
      {
        'properties.terrai_nom': { $regex: new RegExp(`^${searchTerm}`, 'i') },
      },
      {
        type: 'reserve',
        value: '$properties.terrai_nom',
        _id: 0,
      }
    ).sort({ value: 1 })
    return reserves
  }
}

export { ReserveRepository }
