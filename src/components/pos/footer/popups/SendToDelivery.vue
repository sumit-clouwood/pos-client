<template>
  <!-- order confrmation  -->
  <div class="modal fade" id="order-confirmation" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content" v-if="cartItems">
        <SendToDeliveryHeader />
        <SendToDeliveryContent />
        <SendToDeliveryFooter />
      </div>
      <b class="modal-content text-center text-danger pt-3" v-if="!cartItems"
        >No Items Added in Cart</b
      >
    </div>
  </div>
  <!-- End Order confirmation  -->
</template>

<script>
import SendToDeliveryHeader from './SendToDelivery/SendToDeliveryHeader'
import SendToDeliveryContent from './SendToDelivery/SendToDeliveryContent'
import SendToDeliveryFooter from './SendToDelivery/SendToDeliveryFooter'
import { mapState } from 'vuex'

export default {
  name: 'SendToDelivery',
  props: {},
  components: {
    SendToDeliveryHeader,
    SendToDeliveryContent,
    SendToDeliveryFooter,
  },
  computed: {
    ...mapState({
      cartItems: state =>
        state.order.items.length > 0 ? state.order.items : false,
    }),
  },
}
</script>
