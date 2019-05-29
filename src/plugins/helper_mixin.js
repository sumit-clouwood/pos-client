import Vue from 'vue'
import Num from './helpers/Num'
import LookupData from './helpers/LookupData'
import Translation from './helpers/Translation'

Vue.mixin({
  data: function() {
    return {
      Num: Num,
      LookupData: LookupData,
      trans: Translation,
    }
  },
})
