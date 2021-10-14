export function ignoreAccentuation(text: string): string {
  text = text.replace(/[aàáâãäå]/gi, '[aàáâãäå]')
  text = text.replace(/[eéèëê]/gi, '[eéèëê]')
  text = text.replace(/[iíìïî]/gi, '[iíìïî]')
  text = text.replace(/[oóòöôõ]/gi, '[oóòöôõ]')
  text = text.replace(/[uúùüû]/gi, '[uúùüû]')
  text = text.replace(/[cç]/gi, '[cç]')
  return text
}
