import { ISearchDTO } from '../dtos/ISearchDTO'

interface IReserveRepository {
  searchByName(searchTerm: string): Promise<ISearchDTO[]>
  getHomologationPhases(): Promise<String[]>
}

export { IReserveRepository }
