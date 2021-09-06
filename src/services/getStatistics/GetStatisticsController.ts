import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetStatisticsService } from './GetStatisticsService'

class GetStatisticsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filters } = request.body

    const getStatisticsService = container.resolve(GetStatisticsService)

    const statistics = await getStatisticsService.execute(filters)

    return response.json(statistics)
  }
}

export { GetStatisticsController }
