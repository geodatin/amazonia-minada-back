import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { InvasionFrequencyService } from './InvasionRankingService'

class InvasionFrequencyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { territoryType, dataType } = request.params
    const { page } = request.query
    const invasionFrequencyService = container.resolve(InvasionFrequencyService)
    const rankingData = await invasionFrequencyService.execute({
      territoryType,
      dataType,
      page: Number(page),
    })
    return response.status(200).json(rankingData)
  }
}

export { InvasionFrequencyController }
