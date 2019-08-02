<template>
  <div>
    <Location v-show="!loaded" msg="Broccoli POS" />
    <Pos v-show="loaded" msg="Broccoli POS" />
  </div>
</template>

<script>
// @ is an alias to /src
/* global $ */
import Pos from '@/components/Pos.vue'
import Location from '@/components/Location.vue'
import { mapState } from 'vuex'
// import BrandColor from '@/plugins/helpers/BrandColor'

export default {
  name: 'ModifyOrder',
  components: {
    Pos,
    Location,
  },
  computed: {
    ...mapState('sync', ['loaded']),
    ...mapState('location', ['brand']),
  },
  created() {
    if (this.$route.params.order_id) {
      this.$store.dispatch(
        'order/selectedOrderDetails',
        this.$route.params.order_id
      )
      let dis = this
      setTimeout(function() {
        dis.$store.dispatch('deliveryManager/modifyOrder').then(() => {
          dis.$router.push({ path: dis.$store.getters['context/store'] })
        })
      }, 1000)
    }
  },
  mounted() {
    let getBody = $('body')
    getBody.removeAttr('class')
    getBody.attr('class', 'fixed-nav sticky-footer')
    // BrandColor.applyDynamicRules(this.brand)
  },
}
</script>
