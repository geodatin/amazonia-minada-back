import { inject, injectable } from 'tsyringe'

import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import { groupResults } from '../../utils/group'

@injectable()
class GetUsesService {
  constructor(
    @inject('ReserveInvasionRepository')
    private reserveInvasionRepository: IReserveInvasionRepository,

    @inject('InvasionRepository')
    private invasionRepository: IInvasionRepository
  ) {}

  async execute(): Promise<ISearchDTO[]> {
    const reserveUses = await this.reserveInvasionRepository.getUses()
    const unityUses = await this.invasionRepository.getUses()

    const results = groupResults(reserveUses, unityUses)
    return results
  }
}

export { GetUsesService }
