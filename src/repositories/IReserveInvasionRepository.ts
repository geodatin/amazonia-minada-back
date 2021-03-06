import { IFiltersDTO } from '../dtos/IFiltersDTO'
import { IInvasionDTO } from '../dtos/IInvasionDTO'
import { IRequestRankingDTO, IResponseRankingDTO } from '../dtos/IRankingDTO'
import { ISearchDTO } from '../dtos/ISearchDTO'
import { IShapeDTO } from '../dtos/IShapeDTO'

interface IReserveInvasionRepository {
  searchCompany(searchTerm: string): Promise<ISearchDTO[]>
  searchSubstance(searchTerm: string): Promise<ISearchDTO[]>
  listInvasions(filters: IFiltersDTO): Promise<IInvasionDTO[]>
  reserveInvasionRanking({
    propertyType,
    dataType,
    sortOrder,
    filters,
  }: IRequestRankingDTO): Promise<IResponseRankingDTO[]>
  ethnicityRanking(
    dataType: string,
    sortOrder: string,
    filters: IFiltersDTO
  ): Promise<IResponseRankingDTO[]>
  getYears(): Promise<ISearchDTO[]>
  getRequirementsPhase(): Promise<ISearchDTO[]>
  getUses(): Promise<ISearchDTO[]>
  getShape(filters: IFiltersDTO): Promise<IShapeDTO[]>
}

export { IReserveInvasionRepository }
