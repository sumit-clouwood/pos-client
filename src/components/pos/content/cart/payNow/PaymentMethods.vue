<template>
  <div id="payment-method">
    <div
      v-for="(method, key) in methods"
      :key="key"
      :class="{ active: activeMethod == method.name }"
      @click="setMethod(method)"
      :data-toggle="getToggle(method)"
      :data-target="getTarget(method)"
    >
      <img :src="image(method.icon)" alt="method.name" /> <br /><label>{{
        method.name
      }}</label>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'PaymentMethods',
  computed: {
    ...mapGetters('payment', ['methods']),
    ...mapState({
      activeMethod: state => state.checkoutForm.method.name,
    }),
    ...mapState({
      selectedModal: state => state.location.setModal,
    }),
  },
  methods: {
    getToggle(method) {
      if (method.name == 'Loyalty') {
        return 'modal'
      }
      return ''
    },
    image() {
      return 'https://fakeimg.pl/46x46/?text=Third&font=lobster%22'
    },
    getTarget(method) {
      if (method.name == 'Loyalty') {
        if (this.selectedModal == '#manage-customer') {
          return '#search-loyalty-customer'
        } else {
          this.$store.dispatch('checkoutForm/calculateSpendLoyalty')
          return '#loyalty-payment'
        }
      }
      return ''
    },
    ...mapActions('checkoutForm', ['setMethod']),
  },
}
</script>
<style lang="sass" scoped>
img
  height: "46px"
</style>
