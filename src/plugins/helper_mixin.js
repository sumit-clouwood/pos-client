import Vue from 'vue'
import Num from './helpers/Num'
import LookupData from './helpers/LookupData'

Vue.mixin({
  data: function() {
    return {
      Num: Num,
      LookupData: LookupData,
    }
  },
})
