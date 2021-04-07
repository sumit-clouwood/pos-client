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
if (simulatePaySky !== false) {
  // eslint-disable-next-line no-unused-vars
  var AndroidPOS = {
    callFunction: function(func, data, cb) {
      data = JSON.parse(data)
      if (func == 'payWithPaySky') {
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

        //simulatePaySky = [{"data":{"status":true,"state":"error","error_type":"move_card_fast"},"timeout":2000},{"data":{"status":true,"state":"success"},"timeout":3000}]

        const events = JSON.parse(simulatePaySky)

        events
          .reduce(function(mypromise, event) {
            return mypromise.then(() => {
              event.data = Object.assign({}, jsonData, event.data)
              return execChainProcess(event)
            })
          }, Promise.resolve())
          .then(function(results) {
            // all done here with array of results
            console.log(results)
          })
      } else if (func == 'printInvoice') {
        Eventer.emit('paysky', { status: true }, 'invoice')
      }
    },
  }
}
function execChainProcess(event) {
  return new Promise(resolve => {
    setTimeout(() => {
      Eventer.emit('paysky', event.data, 'checkout')
      resolve()
    }, event.timeout)
  })
}
