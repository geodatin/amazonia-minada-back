import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ListInvasionsService } from './ListInvasionsService'

class ListInvasionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filters } = request.body

    const listInvasionsService = container.resolve(ListInvasionsService)

    const invasions = await listInvasionsService.execute(filters)

    return response.json(invasions)
  }
}

export { ListInvasionsController }
