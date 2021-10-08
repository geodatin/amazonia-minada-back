import { ISearchDTO } from '../dtos/ISearchDTO'

interface IReserveRepository {
  searchByName(searchTerm: string): Promise<ISearchDTO[]>
  searchEthnicity(searchTerm: string): Promise<ISearchDTO[]>
  getHomologationPhases(): Promise<ISearchDTO[]>
}

export { IReserveRepository }
