export default {
  round(amount) {
    return (Math.round((parseFloat(amount) + 0.00001) * 100) / 100).toFixed(2)
  },
  toPrice(number) {
    //this converts negetive numbers to 0
    return number > 0 ? number : 0
  },
  //Limit to Only Numbers.
  toNumberOnly(evt) {
    evt = evt ? evt : window.event
    var charCode = evt.which ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      evt.preventDefault()
    } else {
      return true
    }
  },
}
