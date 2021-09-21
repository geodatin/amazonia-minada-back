import { IFiltersDTO } from '../dtos/IFiltersDTO'
import { IInvasionDTO } from '../dtos/IInvasionDTO'
import { IRequestRankingDTO, IResponseRankingDTO } from '../dtos/IRankingDTO'
import { ISearchDTO } from '../dtos/ISearchDTO'

interface IReserveInvasionRepository {
  searchCompany(searchTerm: string): Promise<ISearchDTO[]>
  listInvasions(filters: IFiltersDTO): Promise<IInvasionDTO[]>
  reserveInvasionRanking({
    territoryType,
    dataType,
  }: IRequestRankingDTO): Promise<IResponseRankingDTO[]>
  getRequirementsPhase(): Promise<String[]>
}

export { IReserveInvasionRepository }
