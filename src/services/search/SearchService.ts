import { inject, injectable } from 'tsyringe'

import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { ILicenseRepository } from '../../repositories/ILicenseRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import { IReserveRepository } from '../../repositories/IReserveRepository'
import { IUnityRepository } from '../../repositories/IUnityRepository'
import { groupResults } from '../../utils/group'
import { ignoreAccentuation } from '../../utils/regex'
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
    searchTerm = searchTerm.trim()
    searchTerm = ignoreAccentuation(searchTerm)

    const states = searchStates(searchTerm)

    const reserveCompanies = await this.reserveInvasionRepository.searchCompany(
      searchTerm
    )

    const unityCompanies = await this.invasionRepository.searchCompany(
      searchTerm
    )

    const companies = groupResults(reserveCompanies, unityCompanies)

    const unities = await this.unityRepository.searchByName(searchTerm)

    const reserves = await this.reserveRepository.searchByName(searchTerm)

    const reserveSubstances =
      await this.reserveInvasionRepository.searchSubstance(searchTerm)

    const unitySubstances = await this.invasionRepository.searchSubstance(
      searchTerm
    )

    const substances = groupResults(reserveSubstances, unitySubstances)

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
