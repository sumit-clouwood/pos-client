export default {
  filter(orders, userId) {
    return orders.filter(order => order.cashier_id === userId)
  },
}
