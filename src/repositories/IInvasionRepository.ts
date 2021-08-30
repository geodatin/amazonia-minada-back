import { ISearchDTO } from '../dtos/ISearchDTO'

interface IInvasionRepository {
  searchCompany(searchTerm: string): Promise<ISearchDTO[]>
}

export { IInvasionRepository }
