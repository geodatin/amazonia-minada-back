import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetYearsService } from './GetYearsService'

class GetYearsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getYearsService = container.resolve(GetYearsService)

    const years = await getYearsService.execute()

    return response.json(years)
  }
}

export { GetYearsController }
