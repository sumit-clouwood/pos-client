/* eslint-disable no-console */
/* global Eventer */

// eslint-disable-next-line no-unused-vars
function paySkyCallbackAndroid(functionName, data) {
  var jsonData = JSON.parse(data)
  if (functionName == 'payWithPaySky') {
    Eventer.emit('paysky', jsonData, 'checkout')
  }
}
