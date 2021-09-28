import { inject, injectable } from 'tsyringe'

import { IFiltersDTO } from '../../dtos/IFiltersDTO'
import { IShapeDTO } from '../../dtos/IShapeDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'

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
    if (
      (!(filters.unity && filters.unity.length > 0) ||
        (filters.reserve && filters.reserve.length > 0)) &&
      enableReserve
    ) {
      reserveInvasions = await this.reserveInvasionRepository.getShape(filters)
    }

    if (
      (!(filters.reserve && filters.reserve.length > 0) ||
        (filters.unity && filters.unity.length > 0)) &&
      enableUnity
    ) {
      invasions = await this.invasionRepository.getShape(filters)
    }

    invasions = invasions.map((invasion) => {
      invasion.geometry.coordinates = JSON.parse(invasion.geometry.coordinates)
      return invasion
    })

    reserveInvasions = reserveInvasions.map((invasion) => {
      invasion.geometry.coordinates = JSON.parse(invasion.geometry.coordinates)
      return invasion
    })

    const reserveInvasionsShape = geojson.parse(reserveInvasions, {
      GeoJSON: 'geometry',
    })
    const invasionsShape = geojson.parse(invasions, { GeoJSON: 'geometry' })

    return { reserve: reserveInvasionsShape, unity: invasionsShape }
  }
}

export { GetInvasionsShapeService }
