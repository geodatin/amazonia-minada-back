import { inject, injectable } from 'tsyringe'

import { IFiltersDTO } from '../../dtos/IFiltersDTO'
import { IShapeDTO } from '../../dtos/IShapeDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import {
  checkIfShouldListReserveInvasions,
  checkIfShouldListUnityInvasions,
} from '../../utils/listVerification'

const geojson = require('geojson')

@injectable()
class GetInvasionsShapeService {
  constructor(
    @inject('ReserveInvasionRepository')
    private reserveInvasionRepository: IReserveInvasionRepository,

    @inject('InvasionRepository')
    private invasionRepository: IInvasionRepository
  ) {}

  async execute(
    filters: IFiltersDTO,
    enableUnity: boolean = true,
    enableReserve: boolean = true
  ): Promise<any> {
    let reserveInvasions: IShapeDTO[] = []
    let invasions: IShapeDTO[] = []
    if (checkIfShouldListReserveInvasions(filters) && enableReserve) {
      reserveInvasions = await this.reserveInvasionRepository.getShape(filters)
    }

    if (checkIfShouldListUnityInvasions(filters) && enableUnity) {
      invasions = await this.invasionRepository.getShape(filters)
    }

    const reserveInvasionsShape = geojson.parse(reserveInvasions, {
      GeoJSON: 'geometry',
    })
    const invasionsShape = geojson.parse(invasions, { GeoJSON: 'geometry' })

    return { reserve: reserveInvasionsShape, unity: invasionsShape }
  }
}

export { GetInvasionsShapeService }
