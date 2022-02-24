type filterOptions = {
  [key: string]: string
}

const rankingFilter: filterOptions = {
  state: '$properties.UF',
  reserve: '$properties.TI_NOME',
  unity: '$properties.UC_NOME',
  company: '$properties.NOME',
  substance: '$properties.SUBS',
  requirementPhase: '$properties.FASE',
  use: '$properties.USO',
}

export { rankingFilter }
