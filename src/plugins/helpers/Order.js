export default {
  filter(orders, field, value) {
    return orders.filter(order => order[field] === value)
  },
  lookup(order, group, field, value) {
    let found = null
    order[group].forEach(group => {
      if (!found && group[field] === value) {
        found = group
      }
    })
    return found
  },
  searchHistory(orders, name, user) {
    return orders.filter(order =>
      order.order_history.find(
        orderHistory => orderHistory.name === name && orderHistory.user === user
      )
    )
  },
  userOrders(orders, user) {
    return orders.filter(
      order =>
        order.cashier_id === user ||
        order.order_history.find(
          orderHistory =>
            orderHistory.name === 'ORDER_HISTORY_TYPE_RECORD_NEW' &&
            orderHistory.user === user
        )
    )
  },
}
