<script>
import Discount from './footer/popups/Discount'
import OnlineOrder from './header/popups/OnlineOrder'
import CartItemDiscount from './footer/popups/CartItemDiscount'
import OrderItemPopup from './content/cart/newOrders/items/Popup'
import OnlineOrderDetails from './header/popups/OnlineOrderDetails'

import { mapState, mapGetters } from 'vuex'
/* global $, clickPayNow */
export default {
  name: 'Footer',
  props: {},
  components: {
    Discount,
    OnlineOrderDetails,
    OnlineOrder,
    OrderItemPopup,
    CartItemDiscount,
  },
  data() {
    return {
      vbutton: '',
    }
  },
  computed: {
    ...mapState('checkout', ['print']),
    ...mapState('order', ['orderType', 'cartType']),
    ...mapState('sync', ['online']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapState({
      selectedModal: state =>
        state.location.setModal == '#loyalty-payment'
          ? '#manage-customer'
          : state.location.setModal,
    }),
    ...mapState({
      loyaltyCard: state => state.customer.loyalty.card,
    }),
    ...mapState({ selectedCustomer: state => state.customer.customer.name }),
  },
  methods: {
    payNowClick() {
      clickPayNow()
    },
    viewHoldOrders() {
      this.vbutton = 'new'
      this.$store.commit('order/SET_CART_TYPE', 'hold')
      this.$store.dispatch('holdOrders/getHoldOrders')
    },
    setOrderType(opt) {
      this.$store.commit('order/ORDER_TYPE', opt)
    },
    newOrders() {
      this.vbutton = 'hold'
      this.$store.commit('order/SET_CART_TYPE', 'new')
    },
  },
  updated() {
    $('ul.ullist-icons').slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      accessibility: false,
      dots: false,
      arrows: true,
      nextArrow: '<img class="next-btn" src="img/pos/next-arrow.png"/>',
      prevArrow: '<img class="back-btn" src="img/pos/back-arrow.png"/>',
    })
  },

  mounted() {
    $('ul.ullist-icons').slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      accessibility: false,
      dots: false,
      arrows: true,
      nextArrow: '<img class="next-btn" src="img/pos/next-arrow.png"/>',
      prevArrow: '<img class="back-btn" src="img/pos/back-arrow.png"/>',
    })
  },
}
</script>
