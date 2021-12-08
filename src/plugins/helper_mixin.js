import Vue from 'vue'
import Num from './helpers/Num'
import DateTime from './helpers/DateTime.js'
import LookupData from './helpers/LookupData'
import Trans from './helpers/Trans'
import Payment from './helpers/Payment'

Vue.mixin({
  data: function() {
    return {
      Num: Num,
      DateToday: new DateTime().dateToday(),
      DateAPI: new DateTime().getDate(),
      LookupData: LookupData,
      DateTime: new DateTime(),
      dt: Trans._t,
      Payment: Payment,
    }
  },
})
