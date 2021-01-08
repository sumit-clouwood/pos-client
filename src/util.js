export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

//lookupkey: brand_tax_rates, matchkey: _id, val: 123344432423
export function lookup(lookups, lookupKey, matchKey, val) {
  if (!lookups[lookupKey]) {
    return false
  }
  if (!lookups[lookupKey][matchKey]) {
    return false
  }
  if (!lookups[lookupKey][matchKey][val]) {
    return false
  }
  return lookups[lookupKey][matchKey][val]
}

export function objectToString(obj, glue = ' ') {
  let str = ''
  for (let key in obj) {
    str += obj[key] + glue
  }
  return str
}
