import { IFiltersDTO } from '../dtos/IFiltersDTO'
import { IInvasionDTO } from '../dtos/IInvasionDTO'
import { IRequestRankingDTO, IResponseRankingDTO } from '../dtos/IRankingDTO'
import { ISearchDTO } from '../dtos/ISearchDTO'
import { IShapeDTO } from '../dtos/IShapeDTO'

interface IInvasionRepository {
  searchCompany(searchTerm: string): Promise<ISearchDTO[]>
  searchSubstance(searchTerm: string): Promise<ISearchDTO[]>
  listInvasions(filters: IFiltersDTO): Promise<IInvasionDTO[]>
  invasionRanking({
    propertyType,
    dataType,
    sortOrder,
    filters,
  }: IRequestRankingDTO): Promise<IResponseRankingDTO[]>
  getRequirementsPhase(): Promise<String[]>
  getShape(filters: IFiltersDTO): Promise<IShapeDTO[]>
}

export { IInvasionRepository }
