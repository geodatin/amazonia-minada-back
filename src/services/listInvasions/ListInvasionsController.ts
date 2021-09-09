import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ListInvasionsService } from './ListInvasionsService'

class ListInvasionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filters } = request.body
    const { page, pageSize } = request.query

    const listInvasionsService = container.resolve(ListInvasionsService)

    const invasions = await listInvasionsService.execute(
      filters,
      Number(page) || undefined,
      Number(pageSize) || undefined
    )

    return response.json(invasions)
  }
}

export { ListInvasionsController }
