import { IFiltersDTO } from './IFiltersDTO'

interface IResponseRankingDTO {
  x: string
  y: number
}

interface IRequestRankingDTO {
  territoryType: string
  page: number
  dataType: string
  filters: IFiltersDTO
}

export { IRequestRankingDTO, IResponseRankingDTO }
