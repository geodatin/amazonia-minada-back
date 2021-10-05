import { inject, injectable } from 'tsyringe'

import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import { groupResults } from '../../utils/group'

@injectable()
class GetYearsService {
  constructor(
    @inject('ReserveInvasionRepository')
    private reserveInvasionRepository: IReserveInvasionRepository,

    @inject('InvasionRepository')
    private invasionRepository: IInvasionRepository
  ) {}

  async execute(): Promise<ISearchDTO[]> {
    const reserveYears = await this.reserveInvasionRepository.getYears()
    const unityYears = await this.invasionRepository.getYears()

    const results = groupResults(reserveYears, unityYears)
    return results
  }
}

export { GetYearsService }
