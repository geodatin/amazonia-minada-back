import { IFiltersDTO } from '../dtos/IFiltersDTO'
import { IInvasionDTO } from '../dtos/IInvasionDTO'
import { ISearchDTO } from '../dtos/ISearchDTO'

interface IReserveInvasionRepository {
  searchCompany(searchTerm: string): Promise<ISearchDTO[]>
  listInvasions(filters: IFiltersDTO): Promise<IInvasionDTO[]>
}

export { IReserveInvasionRepository }
