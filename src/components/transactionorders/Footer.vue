<script>
import Invoice from '../pos/content/cart/payNow/Invoice'
import DineIn from './footer/popups/DineIn'
import AddNote from './footer/popups/AddNote'
import Discount from './footer/popups/Discount'
import OnlineOrder from './header/popups/OnlineOrder'
import SendToDelivery from './footer/popups/SendToDelivery'
import ManageCustomer from './footer/popups/ManageCustomer'
import OfflineManageCustomer from './footer/popups/OfflineManageCustomer'
import CartItemDiscount from './footer/popups/CartItemDiscount'
import OrderItemPopup from './content/cart/newOrders/items/Popup'
import CustomerNote from '../pos/footer/popups/ManageCustomer/CustomerNote'
import CustomerCreate from '../pos/footer/popups/ManageCustomer/CustomerCreate'
import CreateCustomerAddress from './footer/popups/ManageCustomer/CustomerAddress/CreateCustomerAddress'
import CartAddEmail from '../pos/content/cart/payNow/popups/AddEmail'
import CartAmountChange from '../pos/content/cart/payNow/popups/AmountChange'
import CartPaymentMsg from '../pos/content/cart/payNow/popups/PaymentMsg'
import CartTipAmount from '../pos/content/cart/payNow/popups/TipAmount'
import CustomerInformation from './footer/popups/ManageCustomer/CustomerInformation'
import CustomerNotes from './footer/popups/ManageCustomer/CustomerInformation/CustomerNotes'
import SelectCustomerAddress from '../pos/footer/popups/ManageCustomer/CustomerAddress/SelectCustomerAddress'
import GiftCard from '../pos/content/cart/newOrders/popup/GiftCard.vue'
import Card from '../pos/content/cart/newOrders/popup/Card.vue'
import GiftCardInfo from '../pos/content/cart/newOrders/popup/GiftCardInfo.vue'
import SearchLoyaltyCustomer from '../pos/footer/popups/SearchLoyaltyCustomer'
import Loyalty from '../pos/content/cart/newOrders/popup/Loyalty.vue'
import OnlineOrderDetails from './header/popups/OnlineOrderDetails'
import OrderDetailsPopup from '@/components/pos/content/OrderDetailPopup'
import UserProfile from '@/components/pos/user/UserProfile'

import { mapState, mapGetters } from 'vuex'
/* global $, clickPayNow */
export default {
  name: 'Footer',
  props: {},
  components: {
    DineIn,
    AddNote,
    Discount,
    OnlineOrderDetails,
    OnlineOrder,
    CustomerNote,
    ManageCustomer,
    OfflineManageCustomer,
    SendToDelivery,
    OrderItemPopup,
    CustomerCreate,
    CreateCustomerAddress,
    CartItemDiscount,
    SelectCustomerAddress,
    CustomerInformation,
    CustomerNotes,
    CartAddEmail,
    CartAmountChange,
    CartPaymentMsg,
    CartTipAmount,
    GiftCard,
    Card,
    GiftCardInfo,
    SearchLoyaltyCustomer,
    Loyalty,
    Invoice,
    OrderDetailsPopup,
    UserProfile,
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
