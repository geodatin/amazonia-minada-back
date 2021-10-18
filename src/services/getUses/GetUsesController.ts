import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetUsesService } from './GetUsesService'

class GetUsesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getUsesService = container.resolve(GetUsesService)

    const uses = await getUsesService.execute()

    return response.json(uses)
  }
}

export { GetUsesController }