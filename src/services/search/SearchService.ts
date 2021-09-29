import { inject, injectable } from 'tsyringe'

import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { ILicenseRepository } from '../../repositories/ILicenseRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import { IReserveRepository } from '../../repositories/IReserveRepository'
import { IUnityRepository } from '../../repositories/IUnityRepository'
import { searchStates } from '../../utils/states'

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
    private reserveRepository: IReserveRepository,

    @inject('LicenseRepository')
    private licenseRepository: ILicenseRepository
  ) {}

  async execute(searchTerm: string): Promise<ISearchDTO[]> {
    const states = searchStates(searchTerm)

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
    const companies = Array.from(companiesMap.values()).sort(
      (company1, company2) =>
        company1.value.toLowerCase() > company2.value.toLowerCase() ? 1 : -1
    )

    const unities = await this.unityRepository.searchByName(searchTerm)

    const reserves = await this.reserveRepository.searchByName(searchTerm)

    const substances = await this.licenseRepository.searchSubstance(searchTerm)

    const ethnicities = await this.reserveRepository.searchEthnicity(searchTerm)

    const results = states.concat(
      companies,
      unities,
      reserves,
      substances,
      ethnicities
    )

    return results
  }
}

export { SearchService }
