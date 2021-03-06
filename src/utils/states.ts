import { ISearchDTO } from '../dtos/ISearchDTO'

const states = new Map<string, string>([
  ['Acre', 'AC'],
  // ['Alagoas', 'AL'],
  ['Amapá', 'AP'],
  ['Amazonas', 'AM'],
  // ['Bahia', 'BA'],
  // ['Ceará', 'CE'],
  // ['Distrito Federal', 'DF'],
  // ['Espírito Santo', 'ES'],
  // ['Goiás', 'GO'],
  ['Maranhão', 'MA'],
  ['Mato Grosso', 'MT'],
  // ['Mato Grosso do Sul', 'MS'],
  // ['Minas Gerais', 'MG'],
  ['Pará', 'PA'],
  // ['Paraíba', 'PB'],
  // ['Paraná', 'PR'],
  // ['Pernambuco', 'PE'],
  // ['Piauí', 'PI'],
  // ['Rio de Janeiro', 'RJ'],
  // ['Rio Grande do Norte', 'RN'],
  // ['Rio Grande do Sul', 'RS'],
  ['Rondônia', 'RO'],
  ['Roraima', 'RR'],
  // ['Santa Catarina', 'SC'],
  // ['São Paulo', 'SP'],
  // ['Sergipe', 'SE'],
  ['Tocantins', 'TO'],
])
const stateNames = Array.from(states.keys())

export function searchStates(searchTerm: string): ISearchDTO[] {
  const regex = new RegExp(`^${searchTerm}`, 'i')
  const results = stateNames
    .filter((state) => regex.test(state))
    .map((state) => {
      return { type: 'state', value: state }
    })
  return results
}

export function getStateAcronym(state: string): string | undefined {
  return states.get(state)
}

export function getStateFromAcronym(acronym: string): string {
  return stateNames.find((key) => states.get(key) === acronym) || acronym
}
