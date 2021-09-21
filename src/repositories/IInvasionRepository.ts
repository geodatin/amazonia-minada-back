import { IFiltersDTO } from '../dtos/IFiltersDTO'
import { IInvasionDTO } from '../dtos/IInvasionDTO'
import { IRequestRankingDTO, IResponseRankingDTO } from '../dtos/IRankingDTO'
import { ISearchDTO } from '../dtos/ISearchDTO'

interface IInvasionRepository {
  searchCompany(searchTerm: string): Promise<ISearchDTO[]>
  listInvasions(filters: IFiltersDTO): Promise<IInvasionDTO[]>
  invasionRanking({
    territoryType,
    dataType,
  }: IRequestRankingDTO): Promise<IResponseRankingDTO[]>
  getRequirementsPhase(): Promise<String[]>
}

export { IInvasionRepository }
