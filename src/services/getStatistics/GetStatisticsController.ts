import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { filterSchema } from '../../yup/schemas/filterSchema'
import { GetStatisticsService } from './GetStatisticsService'

class GetStatisticsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filters } = request.body

    await filterSchema.validate(filters, { abortEarly: false })

    const getStatisticsService = container.resolve(GetStatisticsService)

    const statistics = await getStatisticsService.execute(filters)

    return response.json(statistics)
  }
}

export { GetStatisticsController }
