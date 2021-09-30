import { IFiltersDTO } from './IFiltersDTO'

interface IResponseRankingDTO {
  x: string
  y: number
}

interface IRequestRankingDTO {
  propertyType: string
  page: number
  dataType: string
  sortOrder: string
  filters: IFiltersDTO
}

export { IRequestRankingDTO, IResponseRankingDTO }
