function paginate(array: any[], page: number) {
  return array.slice((page - 1) * 5, page * 5)
}
export { paginate }
