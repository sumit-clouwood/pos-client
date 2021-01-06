export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}
export function objectToString(obj, glue = ' ') {
  let str = ''
  for (let key in obj) {
    str += obj[key] + glue
  }
  return str
}
