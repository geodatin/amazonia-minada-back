import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { filterSchema } from '../../yup/schemas/filterSchema'
import { GetInvasionsShapeService } from './GetInvasionsShapeService'

class GetInvasionsShapeController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filters, enableUnity, enableReserve } = request.body

    await filterSchema.validate(filters, { abortEarly: false })

    const getInvasionsShapeService = container.resolve(GetInvasionsShapeService)

    const shapes = await getInvasionsShapeService.execute(
      filters,
      enableUnity,
      enableReserve
    )
    return response.json(shapes)
  }
}

export { GetInvasionsShapeController }
