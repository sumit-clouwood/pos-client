<template>
  <div>
    <Location v-show="!loaded" msg="Broccoli POS" />
    <Pos v-show="loaded" msg="Broccoli POS" />
    <div class="prefetch">
      <div v-if="getImages">
        <link
          v-for="(url, key) in getImages"
          rel="prefetch"
          :href="url"
          :key="key"
        />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
/* global $ */
import Pos from '@/components/Pos.vue'
import Location from '@/components/Location.vue'
import { mapState, mapGetters } from 'vuex'
// import BrandColor from '@/plugins/helpers/BrandColor'

export default {
  name: 'home',
  data() {
    return {
      orderId: null,
    }
  },
  components: {
    Pos,
    Location,
  },
  computed: {
    ...mapState('sync', ['loaded']),
    ...mapState('location', ['brand']),
    ...mapGetters('auth', ['cashiers']),
    getImages() {
      let bgImage = this.$store.getters['location/bgImage'] || 'img/bg.jpg'
      let images = [bgImage]

      this.cashiers.forEach(cashier => images.push[cashier.avatar])

      return [...images, ...this.$store.getters['payment/getImages']]
    },
  },
  mounted() {
    let getBody = $('body')
    getBody.removeAttr('class')
    getBody.attr('class', 'fixed-nav sticky-footer')
    // BrandColor.applyDynamicRules(this.brand)
    if (this.$route.params.order_id) {
      this.orderId = this.$route.params.order_id
    }

    if (this.orderId && this.$route.name === 'CarhopOrderPay') {
      this.$store.dispatch('order/loadCarhopOrder', this.orderId)
    }
  },
}
</script>
