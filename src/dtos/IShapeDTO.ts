import { IInvasionDTO } from './IInvasionDTO'

interface IShapeDTO extends IInvasionDTO {
  geometry: {
    type: string
    coordinates: any
  }
}

export { IShapeDTO }
