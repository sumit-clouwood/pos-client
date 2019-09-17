<template>
  <div
    class="modal fade bd-example-modal-lg"
    tabindex="-1"
    role="dialog"
    aria-labelledby="myLargeModalLabel"
    aria-hidden="true"
    id="orderDetailsPopup"
  >
    <div class="modal-dialog modal-lg">
      <div class="dialog-body modal-content color-dashboard-background">
        <div class="left-part">
          <LeftPart :orderDetails="selectedOrder" />
        </div>
        <div class="right-part">
          <div class="tab-content" id="nav-tabContent">
            <RightPartHeader />

            <!--content-->
            <Receipt :orderDetails="selectedOrder.item" />
            <History
              :orderDetails="selectedOrder.item"
              :userDetails="selectedOrder.lookups"
            />
            <Modification />
            <Payment :orderDetails="selectedOrder.item" />
          </div>
        </div>
        <div class="buttons">
          <div class="v-menu v-menu--inline">
            <div class="v-menu__activator">
              <div class="dropdown">
                <button
                  class="button btn btn-success color-main color-text-invert dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {{ _t('Reprint') }}
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a
                    class="dropdown-item"
                    href="javascript:void(0)"
                    v-for="(template, index) in selectedOrder.invoice"
                    :key="index"
                    @click="printInvoice(template)"
                    >{{ template.name }}</a
                  >
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="button text-button btn btn-success color-main color-text-invert"
            data-toggle="modal"
            data-target=".cancel-order"
          >
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div class="button-caption">
                {{ _t('Cancel Order') }}
              </div>
            </div>
          </button>
          <button
            type="button"
            class="button text-button btn btn-success color-main color-text-invert"
            @click="modifyOrder"
          >
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div class="button-caption">
                {{ _t('Modify Order') }}
              </div>
            </div>
          </button>
          <button
            type="button"
            class="button past-order-buttons btn btn-success color-main color-text-invert"
          >
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div
                class="button-caption"
                data-toggle="modal"
                data-target="#display-order"
                @click="fetchSelectedCustomer(selectedOrder.customer._id)"
              >
                {{ _t('Open Past Orders') }}
              </div>
            </div>
          </button>
          <button
            type="button"
            class="button btn btn-danger color-button color-text-invert"
            data-dismiss="modal"
          >
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div class="button-caption">
                {{ _t('Close') }}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
    <Invoice />
    <CustomerInformation />
    <CancelOrderPopup />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import Invoice from '@/components/pos/content/cart/payNow/Invoice'
import Receipt from '@/components/pos/content/orderDetails/rightContent/Receipt'
import History from '@/components/pos/content/orderDetails/rightContent/History'
import Modification from '@/components/pos/content/orderDetails/rightContent/Modification'
import Payment from '@/components/pos/content/orderDetails/rightContent/Payment'
import RightPartHeader from '@/components/pos/content/orderDetails/RightPartHeader'
import LeftPart from '@/components/pos/content/orderDetails/LeftPart'
import CancelOrderPopup from '@/components/pos/content/orderDetails/CancelOrderPopup'
import CustomerInformation from '@/components/pos/footer/popups/ManageCustomer/CustomerInformation'

export default {
  name: 'OrderDetailPopup',
  props: {},
  components: {
    RightPartHeader,
    Receipt,
    History,
    Modification,
    Payment,
    LeftPart,
    Invoice,
    CancelOrderPopup,
    CustomerInformation,
  },
  computed: {
    ...mapState('order', ['selectedOrder']),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    ...mapActions('customer', ['fetchSelectedCustomer']),
    ...mapActions('deliveryManager', ['printInvoice']),
    modifyOrder() {
      this.$store.dispatch('deliveryManager/modifyOrder').then(() => {
        this.$router.push({ path: this.$store.getters['context/store'] })
      })
    },
  },
}
</script>
<style scoped lang="scss">
#orderDetailsPopup .modal-dialog {
  max-width: 70%;
}
</style>
