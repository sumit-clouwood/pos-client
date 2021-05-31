export default {
  findDiffString(str1, str2) {
    let diff = ''
    str2.split('').forEach(function(val, i) {
      if (val != str1.charAt(i)) {
        diff += val
      }
    })
    return diff
  },
  diff(obj1, obj2) {
    // Make sure an object to compare is provided
    if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
      return obj1
    }
    let diffs = {}
    let key

    //
    // Compare our objects
    //

    // Loop through the first object
    for (key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        this.compare(obj1[key], obj2[key], key)
      }
    }
    // Loop through the second object and find missing items
    for (key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        if (!obj1[key] && obj1[key] !== obj2[key]) {
          diffs[key] = obj2[key]
        }
      }
    }
    // Return the object of differences
    return diffs
  },
  /**
   * Compare two items and push non-matches to object
   * @param  {*}      item1 The first item
   * @param  {*}      item2 The second item
   * @param  {String} key   The key in our object
   */
  compare(item1, item2, key) {
    // Get the object type
    let type1 = Object.prototype.toString.call(item1)
    let type2 = Object.prototype.toString.call(item2)
    let diffs = {}
    // If type2 is undefined it has been removed
    if (type2 === '[object Undefined]') {
      diffs[key] = null
      return
    }

    // If items are different types
    if (type1 !== type2) {
      diffs[key] = item2
      return
    }

    // If an object, compare recursively
    if (type1 === '[object Object]') {
      let objDiff = this.diff(item1, item2)
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff
      }
      return
    }

    // If an array, compare
    if (type1 === '[object Array]') {
      if (!this.arraysMatch(item1, item2)) {
        diffs[key] = item2
      }
      return
    }
    // Else if it's a function, convert to a string and compare
    // Otherwise, just compare
    if (type1 === '[object Function]') {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2
      }
    } else {
      if (item1 !== item2) {
        diffs[key] = item2
      }
    }
  },
  arraysMatch(arr1, arr2) {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false

    // Check if all items exist and are in the same order
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false
    }

    // Otherwise, return true
    return true
  },
}
