export function getArgs(args) {
  const res = {}
  const [_executor, _file, ...rest] = args
  rest.forEach((value, index, array) => {
    if (value.charAt(0) === '-') {
      if (index + 1 === array.length) {
        res[value.substr(1)] = true
      }
      else if (array[index + 1].charAt(0) !== '-') {
        res[value.substr(1)] = array[index + 1]
      }
      else {
        res[value.substr(1)] = true
      }
    }
  })
  return res
}

