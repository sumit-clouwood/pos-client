export default {
  round(amount) {
    return (Math.round((parseFloat(amount) + 0.00001) * 100) / 100).toFixed(2)
  },
  toPrice(number) {
    //this converts negetive numbers to 0
    return number > 0 ? number : 0
  },
}
