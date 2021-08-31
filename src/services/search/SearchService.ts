import { inject, injectable } from 'tsyringe'

import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import { IReserveRepository } from '../../repositories/IReserveRepository'
import { IUnityRepository } from '../../repositories/IUnityRepository'

@injectable()
class SearchService {
  constructor(
    @inject('ReserveInvasionRepository')
    private reserveInvasionRepository: IReserveInvasionRepository,

    @inject('InvasionRepository')
    private invasionRepository: IInvasionRepository,

    @inject('UnityRepository')
    private unityRepository: IUnityRepository,

    @inject('ReserveRepository')
    private reserveRepository: IReserveRepository
  ) {}

  async execute(searchTerm: string): Promise<ISearchDTO[]> {
    const reserveCompanies = await this.reserveInvasionRepository.searchCompany(
      searchTerm
    )

    const unityCompanies = await this.invasionRepository.searchCompany(
      searchTerm
    )

    const companiesMap = new Map<String, ISearchDTO>()
    reserveCompanies.forEach((company) =>
      companiesMap.set(company.value, company)
    )
    unityCompanies.forEach((company) =>
      companiesMap.set(company.value, company)
    )
    const companies = Array.from(companiesMap.values())

    const unities = await this.unityRepository.searchByName(searchTerm)

    const reserves = await this.reserveRepository.searchByName(searchTerm)

    const results = companies.concat(unities, reserves)

    return results
  }
}

export { SearchService }
