<template>
  <div
    class="modal fade bd-example-modal-lg"
    tabindex="-1"
    role="dialog"
    aria-labelledby="myLargeModalLabel"
    aria-hidden="true"
    id="orderDetailsPopup"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="dialog-body modal-content color-dashboard-background">
        <div class="modal-header mobile">
          <h3 class="modal-title">{{ _t('Order Detail') }}</h3>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="left-part">
          <LeftPart :orderDetails="selectedOrder" />
        </div>
        <div class="right-part">
          <div class="tab-content" id="nav-tabContent">
            <RightPartHeader />

            <!--content-->
            <Receipt :order_data="selectedOrder" />
            <History
              :orderDetails="selectedOrder.item"
              :userDetails="selectedOrder.lookups"
            />
            <Modification />
            <Payment
              :orderDetails="selectedOrder.item"
              :lookups="selectedOrder.lookups"
            />
          </div>
        </div>
        <div class="buttons">
          <div class="v-menu v-menu--inline">
            <div class="v-menu__activator">
              <div class="dropdown">
                <button
                  v-if="allowed(PERMS.REPRINT_ORDER)"
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
                    role="button"
                    v-for="(template, index) in selectedOrder.invoice"
                    :key="index"
                    @click="
                      printInvoiceDisableKitchenPrint({
                        templateId: template._id,
                        order: selectedOrder,
                      })
                    "
                    >{{ template.name }}</a
                  >
                </div>
              </div>
            </div>
          </div>
          <button
            v-if="
              allowed(PERMS.CANCEL_ORDER) &&
                typeof selectedOrder.item !== 'undefined' &&
                selectedOrder.item.order_system_status !== 'requires_acceptance'
            "
            type="button"
            class="button text-button btn btn-success color-main color-text-invert"
            data-toggle="modal"
            data-target=".cancel-order"
            @click="refundAllowed(false)"
          >
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div class="button-caption">{{ _t('Cancel Order') }}</div>
            </div>
          </button>
          <button
            v-if="
              allowed(PERMS.MODIFY_ORDER) &&
                typeof selectedOrder.item !== 'undefined' &&
                !multistore &&
                !selectedOrder.item.credit &&
                selectedOrder.item.order_status === 'finished'
            "
            type="button"
            class="button text-button btn btn-success color-main color-text-invert"
            @click="modifyOrder(selectedOrder.item)"
          >
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div class="button-caption">
                {{ _t('Modify Order') }}
              </div>
            </div>
          </button>

          <button
            v-if="selectedOrder.customer"
            type="button"
            class="button past-order-buttons btn btn-success color-main color-text-invert"
          >
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div
                class="button-caption"
                data-toggle="modal"
                data-target="#display-order"
                @click="fetchCustomer(selectedOrder.customer._id)"
              >
                {{ _t('Open Past Orders') }}
              </div>
            </div>
          </button>
          <button
            v-if="isOrderFromBrandWebOnlinePayment(selectedOrder)"
            type="button"
            class="button btn btn-danger color-button color-text-invert"
            data-toggle="modal"
            @click="refundAllowed(true)"
            data-target=".cancel-order"
          >
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div class="button-caption">{{ _t('Refund') }}</div>
            </div>
          </button>
          <button
            type="button"
            class="button btn btn-danger color-button color-text-invert"
            data-dismiss="modal"
            @click="clearOrder()"
          >
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div class="button-caption">{{ _t('Close') }}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
    <Invoice />
    <CustomerInformation />
    <CancelOrderPopup />
    <ModificationPermissions />
  </div>
</template>

<script>
/* global hideModal */
import { mapState, mapGetters, mapActions } from 'vuex'
import * as CONST from '@/constants'
import Invoice from '@/components/pos/content/cart/payNow/Invoice'
import Receipt from '@/components/pos/content/orderDetails/rightContent/Receipt'
import History from '@/components/pos/content/orderDetails/rightContent/History'
import Modification from '@/components/pos/content/orderDetails/rightContent/Modification'
import Payment from '@/components/pos/content/orderDetails/rightContent/Payment'
import RightPartHeader from '@/components/pos/content/orderDetails/RightPartHeader'
import LeftPart from '@/components/pos/content/orderDetails/LeftPart'
import CancelOrderPopup from '@/components/pos/content/orderDetails/CancelOrderPopup'
import ModificationPermissions from '@/components/pos/content/orderDetails/ModificationPermissions'
import CustomerInformation from '@/components/pos/footer/popups/ManageCustomer/CustomerInformation'
/* global $ */
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
    ModificationPermissions,
  },
  computed: {
    ...mapState('order', ['selectedOrder']),
    ...mapState('dinein', ['tables']),
    ...mapGetters('location', ['_t']),
    ...mapGetters('auth', ['multistore', 'allowed']),
  },
  methods: {
    isOrderFromBrandWebOnlinePayment(order) {
      if (order) {
        if (
          order.item.order_source === CONST.ORDER_SOURCE_WEBSITE &&
          order.item.order_system_status === CONST.ORDER_SYSTEM_STATUS_NORMAL
        ) {
          for (var op of order.item.order_payments) {
            let found = order.lookups.brand_payment_types['_id'][op.entity_id]
            if (found) {
              if (found.type === CONST.PAYMENT_TYPE_ONLINE_ID) {
                return true
              }
            }
          }
          /*return order.item.order_payments.find(
            payment => payment.name === CONST.PAYMENT_TYPE_ONLINE_ID
          )*/
        } else {
          return false
        }
      }
    },
    refundAllowed(status) {
      this.$store.commit('customer/IS_REFUND_ALLOW', status, {
        root: true,
      })
    },
    ...mapActions('customer', ['fetchSelectedCustomer']),
    ...mapActions('deliveryManager', ['printInvoice']),
    fetchCustomer(customerId) {
      hideModal('#orderDetailsPopup')
      this.fetchSelectedCustomer(customerId)
    },
    clearOrder() {
      this.$store.commit('order/CLEAR_SELECTED_ORDER', null, {
        root: true,
      })
    },
    printInvoiceDisableKitchenPrint(details) {
      if (details.order.item && details.order.customer) {
        let customer = {
          customerData: details.order.customer,
          pastOrders: '',
          deliveryAreas: details.order.item.order_delivery_area,
        }
        this.$store.commit('customer/SELECTED_CUSTOMER', customer)
      }
      let dt = this.$store.state.auth.deviceType
      let isIOS = dt.osType
      if (isIOS) {
        //Detect if Reprinted or not.
        if (details.templateId) {
          details.order.item.isReprint = 1
        } else {
          details.order.item.isReprint = 0
        }
      }
      if (window.PrintHandle == null) {
        this.printInvoice(details)
      } else {
        this.$store.dispatch(
          'printingServer/printingServerInvoiceRaw',
          details.order.item
        )
      }
      $('#orderDetailsPopup').modal('hide')
      this.$store.commit('dinein/KITCHEN_PRINT', false)
    },
    modifyOrder(order) {
      this.$store.dispatch('order/startOrder')
      const path = this.$store.getters['context/store'] + '/update/' + order._id
      this.$router.push({ path: path })
      /*
      switch (order.order_type) {
        case CONST.ORDER_TYPE_DINE_IN: {
          let tableData = this.tables.find(
            table => table._id === order.assigned_table_id
          )
          let table_reservation_id = order.table_reservation_id
          this.$store.commit('dinein/SELECTED_TABLE', tableData)
          this.$store.commit('dinein/RESERVATION_ID', table_reservation_id)
          this.$store.commit('dinein/ORDER_RESERVATION_DATA', order)
          this.$store.dispatch('dinein/getSelectedOrder', orderId, {
            root: true,
          })
          this.$router.push({
            path:
              '/dine-in/' +
              this.$store.getters['context/store'] +
              table_reservation_id +
              '/' +
              orderId,
          })
          break
        }
        default: {
          const path =
            this.$store.getters['context/store'] + '/update/' + order._id
          if (order.order_type === CONST.ORDER_TYPE_CALL_CENTER) {
            this.$store.dispatch('deliveryManager/modifyOrder').then(() => {
              this.$router.push({ path: path })
            })
          } else {
            this.$router.push({ path: path })
          }
        }
      }
      */
    },
  },
}
</script>
<style scoped lang="scss">
#orderDetailsPopup .modal-dialog {
  font-size: 0.875rem;
  max-width: 80%;
}
</style>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #orderDetailsPopup {
    .modal-dialog {
      margin: 0;
      width: 100%;
      max-width: 100% !important;
      overflow: auto !important;

      .dialog-body {
        display: block;
        position: static;
        overflow: auto;
        padding-left: 0px !important;
        padding-right: 0px !important;
        padding-top: 0px !important;
        max-height: 80vh !important;
        .details {
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 20px;

          > div {
            padding: 0 0 20px 0;
            display: grid;
            grid-template-columns: 1fr;
            align-content: start;
            align-items: flex-start;

            .details-item {
              border-bottom: 1px solid $gray-middle;
              padding-bottom: 10px;
              display: grid;
              grid-template-columns: max-content max-content;
              grid-gap: 10px;
            }
          }
        }
        .modal-header {
          height: 80px !important;
        }

        .left-part,
        .right-part {
          border: none;
          height: auto;
        }
        .left-part {
          padding-left: 1.5625rem !important;
          padding-right: 1.5625rem !important;
          margin-top: 10px !important;
        }

        .right-part {
          #nav-tabContent {
            #nav-home {
              padding: 3px;

              .table {
                padding: 0;
              }

              .receipt-summary {
                text-align: left;
                font-weight: bold;
                padding: 5px;
              }
            }
          }
        }

        .buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 5px;
          margin: 4px;

          button.button {
            margin: 0;
          }

          .v-menu {
            display: block;
            margin-right: 0;

            .dropdown {
              display: block;
              width: 100%;

              .dropdown-menu {
                overflow: hidden;
              }

              button {
                display: block;
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
