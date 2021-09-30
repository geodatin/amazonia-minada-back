import { Reserve } from '../../database/models/Reserve'
import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IReserveRepository } from '../IReserveRepository'

class ReserveRepository implements IReserveRepository {
  async searchByName(searchTerm: string): Promise<ISearchDTO[]> {
    const reserves = await Reserve.aggregate([
      {
        $match: {
          'properties.terrai_nom': {
            $regex: new RegExp(`^${searchTerm}`, 'i'),
          },
        },
      },
      {
        $group: {
          _id: '$properties.terrai_nom',
        },
      },
      {
        $project: {
          type: 'reserve',
          value: '$_id',
          _id: 0,
        },
      },
      { $sort: { value: 1 } },
    ])
    return reserves
  }

  async searchEthnicity(searchTerm: string): Promise<ISearchDTO[]> {
    const ethnicities: ISearchDTO[] = await Reserve.aggregate([
      {
        $project: {
          ethnicity: {
            $split: ['$properties.etnia_nome', ', '],
          },
        },
      },
      { $unwind: '$ethnicity' },
      { $project: { ethnicity: { $trim: { input: '$ethnicity' } } } },
      { $group: { _id: '$ethnicity' } },
      { $match: { _id: { $regex: new RegExp(`^${searchTerm}`, 'i') } } },
      {
        $project: {
          type: 'reserveEthnicity',
          value: '$_id',
          _id: 0,
        },
      },
      { $sort: { value: 1 } },
    ])
    return ethnicities
  }

  async getHomologationPhases(): Promise<String[]> {
    const homologationPhases = await Reserve.distinct('properties.fase_ti')
    return homologationPhases
  }
}

export { ReserveRepository }
