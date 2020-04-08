import moment from 'moment-timezone'
export default {
  /*get(details) {
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
  },*/
  get(details) {
    const collectionItems = details.collection
    if (
      collectionItems.length > 0 &&
      collectionItems[details.matchWith] != 'undefined'
    ) {
      if (details.selection) {
        return collectionItems[details.matchWith]['name']
      } else {
        return collectionItems[details.matchWith]
      }
    }
    //TODO Remove it later
    if (
      typeof collectionItems != 'undefined' &&
      typeof collectionItems[details.matchWith] != 'undefined'
    ) {
      if (details.selection) {
        return collectionItems[details.matchWith][details.selection]
      } else {
        return collectionItems[details.matchWith]
      }
    }
    return 'NA'
  },

  getUserAssociatedDetails(details) {
    const collectionItems = details.collection
    let length = 0
    if (typeof collectionItems === 'object') {
      length = Object.keys(collectionItems).length
    } else {
      length = collectionItems.length
    }
    if (length > 0 && collectionItems[details.matchWith] != 'undefined') {
      if (details.selection) {
        return collectionItems[details.matchWith][details.selection]
      } else {
        return collectionItems[details.matchWith]
      }
    }
    return 'NA'
  },
  /*getPromises(details) {
    const collectionItems = Object.entries(details.collection)
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line ,no-unused-vars
      for (let [key, value] of collectionItems) {
        if (typeof value.item_status != 'undefined' && !value.item_status) {
          return reject()
        }
        if (value._id == details.matchWith) {
          if (details.selection) {
            return resolve(value.name)
          } else {
            return resolve(value)
          }
        }
      }
    })
  },*/
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
    if (str) {
      return str.replace(/[_-]/g, ' ')
    }
    return str
  },
}
