import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ListInvasionsService } from './ListInvasionsService'

class ListInvasionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filters, enableUnity, enableReserve } = request.body
    const { page, pageSize } = request.query

    const listInvasionsService = container.resolve(ListInvasionsService)

    const invasions = await listInvasionsService.execute(
      filters,
      enableUnity,
      enableReserve,
      Number(page) || undefined,
      Number(pageSize) || undefined
    )

    return response.json(invasions)
  }
}

export { ListInvasionsController }
