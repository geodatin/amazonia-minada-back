interface IResponseRankingDTO {
  x: string
  y: number
}

interface IRequestRankingDTO {
  territoryType: string
  page: number
  dataType: string
}

export { IRequestRankingDTO, IResponseRankingDTO }
