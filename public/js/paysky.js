/* eslint-disable no-console */
/* global Eventer */

// eslint-disable-next-line no-unused-vars
function paySkyCallbackAndroid(functionName, data) {
  var jsonData = JSON.parse(data)
  if (functionName == 'payWithPaySky') {
    Eventer.emit('paysky', jsonData, 'checkout')
  }
}
const simulatePaySky = localStorage.getItem('simulatePaySky')
if (simulatePaySky) {
  // eslint-disable-next-line no-unused-vars
  var AndroidPOS = {
    callFunction: function(func, data, cb) {
      data = JSON.parse(data)

      let jsonData = {
        status: true,
        state: 'start',
        transaction_token: data.auth.transaction_token,

        response: {
          CardinalChallengeComplete: false,
          CardinalChallengeRequired: false,
          CardinalChallengeRequiredWithoutCardinalSDK: false,
          CardinalNotChallengeRequired: false,
          PreChallengeRequired: false,
          ActionCode: '00',
          AuthCode: '036681',
          ChallengeRequired: false,
          MerchantReference: '439089068',
          Message: 'Approved',
          NetworkReference: '10005909605',
          ReceiptNumber: '108220625942',
          RefNumber: '10005909605',
          Success: true,
          SystemReference: 84644,
          TransactionNo: '10005909605',
          PAN: '1234',
        },
        message: 'Approved',
      }

      Eventer.emit('paysky', jsonData, 'checkout')
      setTimeout(() => {
        jsonData.state = 'processing'
        Eventer.emit('paysky', jsonData, 'checkout')
        setTimeout(() => {
          jsonData.state = 'success'
          Eventer.emit('paysky', jsonData, 'checkout')
        }, 3000)
      }, 3000)
    },
  }
}
