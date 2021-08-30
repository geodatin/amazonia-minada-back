import { ISearchDTO } from '../dtos/ISearchDTO'

interface IReserveInvasionRepository {
  searchCompany(searchTerm: string): Promise<ISearchDTO[]>
}

export { IReserveInvasionRepository }
