<template>
  <div class="carhop-completed-orders-wrapper">
    <div v-if="orders.data.length">
      <div class="carhop-completed-orders">
        <table class="responsive-table">
          <thead>
            <tr>
              <th class="table_header" style="width: 150px">Order No</th>
              <th class="table_header" width="400px">Items</th>
              <th class="table_header" style="width: 150px">Amount</th>
              <th class="table_header" style="width: 100px">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders.data" :key="order._id">
              <td>
                <span
                  class="in-progress order-number open-details-popup cursor-pointer font-weight-bold text-capitalize"
                  @click="selectedOrderDetails(order._id)"
                  data-dismiss="modal"
                  data-target=".bd-example-modal-lg"
                  data-toggle="modal"
                  >Order # {{ order.order_no }}</span
                >
              </td>
              <td class="mobile-items">
                <div
                  v-for="item in order.items"
                  :key="item.no"
                  class="item-name"
                >
                  <span>{{ item.name }} ({{ item.qty }})</span>
                </div>
              </td>
              <td class="font-weight-bold">
                {{ order.currency }} {{ order.balance_due }}
              </td>
              <td>
                <div class="button-wrapper btn-align-row">
                  <ready-action :order="order"></ready-action>
                  <div class="dropdown text-right">
                    <button
                      class="button btn btn-success color-main color-text-invert dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      @click="selectedOrderDetails(order._id)"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="19"
                        viewBox="0 0 22 19"
                      >
                        <g fill="#fff" fill-rule="nonzero">
                          <path
                            d="M2.68 7.096c0-2.825-.274-2.568 1.51-2.568V1.113c0-.53.438-.963.968-.963h11.684c.53 0 .967.433.967.963v3.415c1.785 0 1.511-.257 1.511 2.568.832 0 2.44-.26 2.44.95v5.993a.96.96 0 0 1-.963.946h-2.988v2.832a.971.971 0 0 1-.967.963H5.158a.971.971 0 0 1-.967-.963v-2.832H1.203a.96.96 0 0 1-.964-.946V8.046c0-.527.44-.95.964-.95H2.68zM3.702 5.55v1.546h.489V5.55h-.489zm14.596 0h-.489v1.546h.489V5.55zm-.489 7.425v.987h2.93V8.12H1.261v5.843H4.19c0-.499-.177-1.951.967-1.951h11.684c.593 0 .964.596.964.964h.003zm-1.022 4.78l-.007-4.718H5.217l-.004 4.717h11.574zM5.213 1.171v5.924h11.574V1.172H5.213z"
                          />
                          <path
                            d="M17.518 9.8c-.672 0-.672-1.023 0-1.023h1.643c.676 0 .676 1.023 0 1.023h-1.643z"
                          />
                        </g>
                      </svg>
                      {{ _t('Print') }}
                    </button>
                    <div
                      class="dropdown-menu dropdown-menu-right animate slideIn"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <a
                        class="dropdown-item"
                        role="button"
                        v-for="(template, index) in selectedOrder.invoice"
                        :key="index"
                        @click="
                          printInvoice({
                            templateId: template._id,
                            order: selectedOrder,
                          })
                        "
                        >{{ template.name }}</a
                      >
                    </div>
                  </div>
                  <div class="paid-amount-msg text-left font-weight-bold">
                    <img src="img/dinein/paid-icon.png" style="width:33px" />
                    {{ _t('Paid') }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-wrapper">
        <div class="pagination-customer-details">
          <paginate
            v-if="orders.count"
            :page-count="Math.ceil(orders.count / limit)"
            :page-range="2"
            :margin-pages="2"
            :clickHandler="fetchMore"
            :prev-text="_t('Prev')"
            :next-text="_t('Next')"
            :container-class="''"
            :page-class="_t('page-item')"
            v-model="page"
          ></paginate>
        </div>
      </div>
    </div>
    <div v-else>
      <span class="not-found">No orders for today yet.</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import paginate from 'vuejs-paginate'
import ReadyAction from './ReadyAction'

export default {
  name: 'CompletedOrders',
  props: {
    orders: Object,
  },
  components: {
    ReadyAction,
    paginate,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('carhop', ['limit']),
    ...mapState('order', ['selectedOrder']),
    ...mapGetters('location', ['_t']),
    page: {
      get() {
        return this.$store.getters['carhop/page']('finished')
      },
      set(page) {
        this.$store.commit('carhop/SET_PAGE', {
          page: page,
          orderStatus: 'finished',
        })
      },
    },
  },

  methods: {
    ...mapActions('carhop', ['fetchOrders']),
    ...mapActions('order', ['selectedOrderDetails']),
    ...mapActions('deliveryManager', ['printInvoice']),
    fetchMore(page) {
      this.fetchOrders({ orderStatus: 'finished', page: page })
    },
  },
}
</script>
<style lang="sass" scoped>
.carhop-completed-orders-wrapper
  padding: 30px

  .carhop-completed-orders
    display: block
    height: calc(100vh - 205px)
    overflow: auto

  .pagination-wrapper
    display: block
    overflow: hidden

  .button-wrapper
    grid-gap: 15px
    float: right

  .paid-amount-msg
    color: #7ac241
</style>
<style lang="scss" scoped>
@import '@/assets/scss/responsive_table.scss';
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.carhop-completed-orders {
  &::-webkit-scrollbar {
    width: 0rem;
    height: 0rem;
  }
}

#dropdownMenuButton {
  svg {
    height: 1.25rem;
    width: 1.5rem;
    vertical-align: middle;
    margin-right: 0.125rem;
  }
}
.btn-align-row {
  display: grid;
  grid-template-columns: auto auto auto !important;
}
@include responsive(mobile) {
  .carhop-completed-orders-wrapper {
    padding: 10px;
    font-size: 0.75rem;
    tr {
      overflow-y: scroll;
      .mobile-items {
        max-height: 20vh;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          width: 0.625rem;
          height: 0.625rem !important;
        }
      }
    }
  }
  .item-name {
    font-size: 12px !important;
  }
  .pagination-wrapper {
    height: 65px;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    margin-right: 0px;
    margin-left: 0px;
    padding: 4px;
    border-top: 1px solid gray;
    overflow-x: scroll !important;
    z-index: 1;
    background: ghostwhite !important;
    opacity: 1 !important;
  }
  .carhop-completed-orders-wrapper .carhop-completed-orders {
    height: calc(95vh - 150px);
  }
  .pagination-customer-details {
    display: flex;
    width: 95%;
    margin: auto;
    flex-direction: row;
    justify-content: flex-start;
  }
  .button-wrapper {
    width: max-content;
    margin-left: 0px !important;
  }
  .button-wrapper > a span.dinefor-paynow {
    margin-left: 0;
  }
}
.responsive-table {
  @extend %responive-tables;
  @include responive-tables('ORDER NO', 'ITEMS', 'AMOUNT', 'STATUS');
}
</style>
