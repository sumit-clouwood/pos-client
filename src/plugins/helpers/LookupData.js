import moment from 'moment-timezone'

export default {
  get(details) {
    const collectionItems = Object.entries(details.collection)
    // eslint-disable-next-line no-console,no-unused-vars
    for (let [key, value] of collectionItems) {
      if (typeof value.item_status != 'undefined' && !value.item_status) {
        return false
      }
      if (value._id == details.matchWith) {
        if (details.selection) {
          return value.name
        } else {
          return value
        }
      }
    }
  },
  convertDatetimeCustom(datetime, tz, format = 'YYYY-MM-DD HH:mm:ss') {
    moment.locale(tz)
    var value =
      datetime != null && typeof datetime.$date != 'undefined'
        ? parseInt(datetime.$date.$numberLong)
        : datetime
    var result = ''
    if (value) {
      if (!moment.utc(value).isValid()) return ''
      var fmt_in = moment(value)._f
      result = moment
        .utc(value, fmt_in)
        .tz(tz)
        .format(format)
    }
    return result
  },
  setSortedArr(details) {
    const collectionItems = Object.entries(details)
    let orderArr = []
    for (let [key, value] of collectionItems) {
      orderArr[key] = value
    }
    return orderArr
  },
  check(data) {
    const collectionItems = Object.entries(data.collection)
    // eslint-disable-next-line no-console,no-unused-vars
    for (let [key, value] of collectionItems) {
      if (value._id == data.matchWith) {
        return value.name
      }
    }
  },
  replaceUnderscoreHyphon(str) {
    return str.replace(/[_-]/g, ' ')
  },
}
