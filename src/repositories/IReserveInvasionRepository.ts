import { IFiltersDTO } from '../dtos/IFiltersDTO'
import { IInvasionDTO } from '../dtos/IInvasionDTO'
import { IRequestRankingDTO, IResponseRankingDTO } from '../dtos/IRankingDTO'
import { ISearchDTO } from '../dtos/ISearchDTO'
import { IShapeDTO } from '../dtos/IShapeDTO'

interface IReserveInvasionRepository {
  searchCompany(searchTerm: string): Promise<ISearchDTO[]>
  listInvasions(filters: IFiltersDTO): Promise<IInvasionDTO[]>
  reserveInvasionRanking({
    propertyType,
    dataType,
    filters,
  }: IRequestRankingDTO): Promise<IResponseRankingDTO[]>
  ethnicityRanking(
    dataType: string,
    filters: IFiltersDTO
  ): Promise<IResponseRankingDTO[]>
  getRequirementsPhase(): Promise<String[]>
  getShape(filters: IFiltersDTO): Promise<IShapeDTO[]>
}

export { IReserveInvasionRepository }
