import { Unity } from '../../database/models/Unity'
import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IUnityRepository } from '../IUnityRepository'

class UnityRepository implements IUnityRepository {
  async searchByName(searchTerm: string): Promise<ISearchDTO[]> {
    const unities = await Unity.find(
      {
        'properties.nome': { $regex: new RegExp(`^${searchTerm}`, 'i') },
      },
      {
        type: 'unity',
        value: '$properties.nome',
        _id: 0,
      }
    )
    return unities
  }
}

export { UnityRepository }
