export default {
  get(details) {
    const collectionItems = Object.entries(details.collection);
    // eslint-disable-next-line no-console,no-unused-vars
    for (let [key, value] of collectionItems) {
      if (typeof value.item_status != "undefined" && !value.item_status) {
        return false;
      }
      if (value._id == details.matchWith) {
        if (details.selection) {
          return value.name;
        } else {
          return value;
        }
      }
    }
  }
};
