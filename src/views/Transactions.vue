<template>
  <div>
    <Location v-show="!loaded" msg="Broccoli POS" />
    <Transactions v-show="loaded" msg="Broccoli POS" />
  </div>
</template>

<script>
// @ is an alias to /src
/* global $ */
import Transactions from '@/components/Transactions.vue'
import Location from '@/components/Location.vue'
import { mapState } from 'vuex'
// import BrandColor from '@/plugins/helpers/BrandColor'

export default {
  name: 'transactionorders',
  components: {
    Transactions,
    Location,
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
