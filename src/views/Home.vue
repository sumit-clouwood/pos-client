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
import * as CONST from '@/constants'
// import BrandColor from '@/plugins/helpers/BrandColor'

export default {
  name: 'home',
  data() {
    return {
      orderId: null,
      customerId: null,
      addressId: null,
      groupId: null,
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
    let vh = window.innerHeight * 0.01
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    // We listen to the resize event
    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
    let getBody = $('body')
    getBody.removeAttr('class')
    getBody.attr('class', 'fixed-nav sticky-footer')
    // BrandColor.applyDynamicRules(this.brand)

    if (this.$route.name.match('Carhop')) {
      this.$store.commit('order/ORDER_TYPE', {
        OTview: 'Carhop',
        OTApi: CONST.ORDER_TYPE_CARHOP,
      })
    }
    if (this.$route.name.match('Takeaway')) {
      this.$store.commit('order/ORDER_TYPE', {
        OTview: 'Take Away',
        OTApi: 'takeaway',
      })
    }
    if (this.$route.params.order_id) {
      this.orderId = this.$route.params.order_id
    }
    if (this.orderId && this.$route.name === 'TakeawayOrderPay') {
      this.$store.dispatch('order/loadCarhopOrder', this.orderId)
    }
    if (this.orderId && this.$route.name === 'CarhopOrderPay') {
      this.$store.dispatch('order/loadCarhopOrder', this.orderId)
    }

    if (this.$route.name.match('selectAddressForCrmOrder')) {
      this.customerId = this.$route.params.customer_id
      this.addressId = this.$route.params.address_id
      this.$store.dispatch('customer/setAddressForDelivery', {
        customerId: this.customerId,
        addressId: this.addressId,
      })
    }

    if (this.$route.name.match('selectCustomerForTakeawayOrder')) {
      this.customerId = this.$route.params.customer_id
      //this.$store.commit('ORDER_TYPE, { OTview: 'Take Away', OTApi: 'takeaway' })
      this.$store
        .dispatch('customer/fetchSelectedCustomer', this.customerId)
        .then(() => {
          // alert(this.customerId)
          // this.$store.commit('order/ORDER_TYPE', {
          //   OTview: 'Take Away',
          //   OTApi: 'takeaway',
          // })
          // this.$store.dispatch('checkoutForm/calculateLoyaltyAmountForItem')
        })
      this.$store.commit('order/ORDER_TYPE', {
        OTview: 'Take Away',
        OTApi: 'takeaway',
      })
    }
    /* Implemented for multistore*/
    if (this.$route.name.match('iosApplication')) {
      localStorage.setItem('IOSPrinters', '')
      let iosprinter = this.$route.params.iosprinter.split('=')[1]
      /*"iosprinter=abc+xyz+yelo"*/
      localStorage.setItem('IOSPrinters', JSON.stringify(iosprinter.split('+')))
      // eslint-disable-next-line no-console
      console.log(localStorage.getItem('IOSPrinters'))
    }
    if (this.$route.name.match('selectGroupForCrmOrder')) {
      this.customerId = this.$route.params.customer_id
      this.addressId = this.$route.params.address_id
      this.groupId = this.$route.params.group_id
      this.$store.dispatch('customer/setAddressForDelivery', {
        customerId: this.customerId,
        addressId: this.addressId,
      })
      this.$store.dispatch('context/getStoresByGroupID', this.groupId)
    }
  },
}
</script>
