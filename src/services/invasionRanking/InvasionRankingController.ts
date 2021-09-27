import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { InvasionRankingService } from './InvasionRankingService'

class InvasionRankingController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { propertyType, dataType } = request.params
    const { filters } = request.body
    const { page } = request.query
    const invasionRankingService = container.resolve(InvasionRankingService)
    const rankingData = await invasionRankingService.execute({
      propertyType,
      dataType,
      page: Number(page) || 1,
      filters,
    })
    return response.status(200).json(rankingData)
  }
}

export { InvasionRankingController }
