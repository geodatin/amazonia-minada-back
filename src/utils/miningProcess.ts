const miningProcessObject = new Map<string, string>([
  ['CONCESSÃO DE LAVRA', 'miningConcession'],
  ['LAVRA GARIMPEIRA', 'smallScaleMining'],
  ['AUTORIZAÇÃO DE PESQUISA', 'miningResearchAuthorization'],
  ['REQUERIMENTO DE PESQUISA', 'miningResearchRequest'],
  ['REQUERIMENTO DE LAVRA GARIMPEIRA', 'smallScaleMiningRequest'],
  ['REQUERIMENTO DE LAVRA', 'smallScaleMiningRequest'],
  ['DIREITO DE REQUERER A LAVRA', 'smallScaleMiningRequest'],
  ['APTO PARA DISPONIBILIDADE', 'availableMiningArea'],
  ['DISPONIBILIDADE', 'availableMiningArea'],
])

export function getMiningProcessType(
  miningProcess: string
): string | undefined {
  return miningProcessObject.get(miningProcess)
}
