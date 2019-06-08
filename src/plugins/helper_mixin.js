import Vue from 'vue'
import Num from './helpers/Num'
import DateTime from './helpers/DateTime.js'
import LookupData from './helpers/LookupData'
import Trans from './helpers/Trans'

Vue.mixin({
  data: function() {
    return {
      Num: Num,
      DateToday: new DateTime().dateToday(),
      LookupData: LookupData,
      dt: Trans._t,
    }
  },
})
