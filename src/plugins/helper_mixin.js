import Vue from 'vue'
import Num from './helpers/Num'
import DateTime from './helpers/DateTime.js'
import LookupData from './helpers/LookupData'
import BrandColor from './helpers/BrandColor'
import Trans from './helpers/Trans'

Vue.mixin({
  data: function() {
    return {
      Num: Num,
      DateToday: new DateTime().dateToday(),
      LookupData: LookupData,
      BrandColor: BrandColor,
      dt: Trans._t,
    }
  },
})
