import { ISearchDTO } from '../dtos/ISearchDTO'

interface IUnityRepository {
  searchByName(searchTerm: string): Promise<ISearchDTO[]>
}

export { IUnityRepository }
