export default function wildCardSearch(list, input, specifyKey) {
  const searchText = (item) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in item) {
      if (item[specifyKey || key] == null) {
        // eslint-disable-next-line no-continue
        continue
      }
      if (
        item[specifyKey || key]
          .toString()
          .toUpperCase()
          .indexOf(input.toString().toUpperCase()) !== -1
      ) {
        return true
      }
    }
  }
  const result = list.filter((value) => searchText(value))
  return result
}
