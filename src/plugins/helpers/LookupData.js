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
