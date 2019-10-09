<template>
  <div>
    <Location v-show="!loaded" msg="Broccoli POS" />
    <Pos v-show="loaded && cashier" msg="Broccoli POS" />
    <cashier v-show="loaded && !cashier" />
  </div>
</template>

<script>
// @ is an alias to /src
/* global $ */
import Pos from '@/components/Pos.vue'
import Cashier from '@/components/login/Cashier.vue'
import Location from '@/components/Location.vue'
import { mapState } from 'vuex'
// import BrandColor from '@/plugins/helpers/BrandColor'

export default {
  name: 'home',
  data() {
    return {
      cashier: false,
    }
  },
  components: {
    Pos,
    Location,
    Cashier,
  },
  computed: {
    ...mapState('sync', ['loaded']),
    ...mapState('location', ['brand']),
  },
  mounted() {
    let getBody = $('body')
    getBody.removeAttr('class')
    getBody.attr('class', 'fixed-nav sticky-footer')
    // BrandColor.applyDynamicRules(this.brand)
  },
}
</script>
