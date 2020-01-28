export default {
  filter(multiStoreData, key) {
    let merged = []
    //first merge all data into single array with ids
    for (const storeId in multiStoreData) {
      merged = merged.concat(multiStoreData[storeId].map(entity => entity[key]))
    }
    //get common elements only from that merged array
    let commonIds = [
      ...new Set(
        merged.filter((element, index, self) => self.indexOf(element) !== index)
      ),
    ]
    //return actual data based on those common ids
    if (!commonIds.length) {
      commonIds = merged
    }

    let commonData = {}
    for (const storeId in multiStoreData) {
      for (const i in multiStoreData[storeId]) {
        if (commonIds.includes(multiStoreData[storeId][i][key])) {
          commonData[multiStoreData[storeId][i][key]] =
            multiStoreData[storeId][i]
        }
      }
    }
    return Object.values(commonData)
  },
}
