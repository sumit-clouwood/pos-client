/* eslint-disable no-console */
/* global showModal hideModal*/
// eslint-disable-next-line no-unused-vars
// function payWithPaySky(data, callback) {
//   data = JSON.parse(data)
//   data.code = 1234
//   data.status = 'start'
//   window[callback]('payWihPaySky', JSON.stringify(data))
// }
// eslint-disable-next-line no-unused-vars

HTMLElement.prototype.prependHtml = function(element) {
  const div = document.createElement('div')
  div.innerHTML = element
  this.insertBefore(div, this.firstChild)
}
HTMLElement.prototype.appendHtml = function(element) {
  const div = document.createElement('div')
  div.innerHTML = element
  while (div.children.length > 0) {
    this.appendChild(div.children[0])
  }
}

function log(data) {
  console.log(data)
  localStorage.setItem('logData', localStorage.getItem('logData') + '\n' + data)
  //document.body.prependHtml(data)
}
// eslint-disable-next-line no-unused-vars
function paySkyCallbackAndroid(functionName, data) {
  log('call back paysky called')
  log(data)

  var jsonData = JSON.parse(data)
  log(jsonData)
  if (jsonData.status == true) {
    log(functionName)

    if (functionName == 'payWihPaySky') {
      log(jsonData.state)
      if (jsonData.state == 'start') {
        showModal('#payment-msg')
        //open payment screen code here
        log(jsonData.state)
      } else {
        hideModal('#payment-msg')
        if (jsonData.state == 'success') {
          //payment screen close code here
          log('success')
          log(jsonData.response)
        } else if (jsonData.state == 'fail') {
          //[nfc_not_found,move_card_fast,unknown_emv_card,card_with_locked_nfc,login_error,payment_error]
          log(jsonData.error_type)
          log(jsonData.error_message)
          //payment fail handle here
          log('fail')
        }
      }
    }
  } else {
    log('failed')
  }

  // this.$store
  //   .dispatch('checkoutForm/addCardAmount', data.code)
  //   .then(payable => {
  //     this.code = ''
  //     if (payable <= 0.1 || this.$store.state.checkoutForm.action == 'pay') {
  //       if (this.needSupervisorAccess) {
  //         showModal('#modificationReason')
  //         resolve()
  //       } else {
  //         if (this.$store.getters['checkoutForm/validate']) {
  //           this.executePayment(this.$store.state.order.orderType.OTApi)
  //           resolve()
  //         }
  //       }
  //     }
  //   })
  //   .catch(error => reject(error))
}
