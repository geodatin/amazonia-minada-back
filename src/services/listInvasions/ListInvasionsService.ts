import { inject, injectable } from 'tsyringe'

import { IFiltersDTO } from '../../dtos/IFiltersDTO'
import { IInvasionDTO } from '../../dtos/IInvasionDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import {
  checkIfShouldListReserveInvasions,
  checkIfShouldListUnityInvasions,
} from '../../utils/listVerification'
import { getMiningProcessType } from '../../utils/miningProcess'

@injectable()
class ListInvasionsService {
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
  ): Promise<IInvasionDTO[]> {
    let reserveInvasions: IInvasionDTO[] = []
    let invasions: IInvasionDTO[] = []

    if (checkIfShouldListReserveInvasions(filters) && enableReserve) {
      reserveInvasions = await this.reserveInvasionRepository.listInvasions(
        filters
      )
    }

    if (checkIfShouldListUnityInvasions(filters) && enableUnity) {
      invasions = await this.invasionRepository.listInvasions(filters)
    }

    const results = invasions.concat(reserveInvasions).map((invasion) => {
      invasion.miningProcessType = getMiningProcessType(invasion.miningProcess)
      return invasion
    })
    const sortedResults = results.sort((a, b) => {
      if (b.year > a.year) {
        return 1
      } else if (b.year < a.year) {
        return -1
      } else {
        if (b.process > a.process) {
          return 1
        } else if (b.process < a.process) {
          return -1
        }
        return 0
      }
    })

    return sortedResults
  }
}

export { ListInvasionsService }
