import { License } from '../../database/models/License'
import { ISearchDTO } from '../../dtos/ISearchDTO'
import { ILicenseRepository } from '../ILicenseRepository'

class LicenseRepository implements ILicenseRepository {
  async searchSubstance(searchTerm: string): Promise<ISearchDTO[]> {
    const substances = await License.aggregate([
      {
        $match: {
          'properties.SUBS': { $regex: new RegExp(`^${searchTerm}`, 'i') },
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
}

export { LicenseRepository }