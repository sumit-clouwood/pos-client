<template>
  <div class="carhop-running-orders-wrapper">
    <div v-if="orders && orders.data && orders.data.length">
      <div class="carhop-running-orders">
        <table class="responsive-table">
          <thead>
            <tr>
              <th class="table_header" style="width: 150px">
                {{ _t('Order No') }}
              </th>
              <th class="table_header" width="400px">{{ _t('Items') }}</th>
              <th class="table_header" style="width: 150px">
                {{ _t('Amount') }}
              </th>
              <th class="table_header" style="width: 100px">
                {{ _t('Status') }}
              </th>
              <th class="table_header text-center" style="width: 215px">
                {{ _t('Action') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders.data" :key="order._id">
              <td>
                <span
                  class="in-progress order-number open-details-popup cursor-pointer text-capitalize"
                  @click="selectedOrderDetails(order._id)"
                  data-dismiss="modal"
                  data-target=".bd-example-modal-lg"
                  data-toggle="modal"
                  >{{ _t('Order') }} # {{ order.order_no }}</span
                >
              </td>
              <td class="mobile-items">
                <div
                  v-for="item in order.items"
                  :key="item.no"
                  class="item-name"
                >
                  <span> {{ item.name }} ({{ item.qty }}) </span>
                </div>
              </td>
              <td class="font-weight-bold">
                {{ order.currency }} {{ order.balance_due }}
              </td>
              <td>
                <span class="in-progress">{{ _t('Running') }}</span>
              </td>
              <td>
                <div class="button-wrapper btn-align-row">
                  <ready-action
                    :order="order"
                    class="carhop-ready-"
                  ></ready-action>
                  <button
                    v-if="
                      (order.dispatch_history &&
                        order.dispatch_history.new &&
                        order.dispatch_history.new.length) ||
                        typeof order.dispatch_history === undefined
                    "
                    class="button btn btn-success carhop-completed"
                    @click="orderCollection(order._id)"
                  >
                    {{ _t('Collected') }}
                  </button>
                  <div class="dropdown">
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
                      <span>{{ _t('Print') }}</span>
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
                  <router-link
                    v-if="canPay && !order.order_payments.length"
                    :to="'/carhop' + store + '/' + order._id"
                    class="pay-now-carhop"
                  >
                    <span class="dinefor-paynow">
                      <svg
                        height="21"
                        viewBox="0 0 30 21"
                        width="30"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fill="#FFF" fill-rule="nonzero">
                          <path
                            d="M27.325.316H18.3v1.201h5.43c.05.498.201 1.008.444 1.512a6.63 6.63 0 0 0 1.283 1.777c.524.524 1.098.94 1.683 1.236.462.234.93.391 1.39.465v5.082c-.46.073-.928.23-1.39.465a6.678 6.678 0 0 0-1.683 1.235 6.622 6.622 0 0 0-1.282 1.778 4.537 4.537 0 0 0-.444 1.511H9.235a4.537 4.537 0 0 0-.444-1.511 6.636 6.636 0 0 0-1.283-1.778 6.678 6.678 0 0 0-1.683-1.236 4.766 4.766 0 0 0-1.39-.465v-5.08c.46-.075.929-.232 1.39-.466a6.678 6.678 0 0 0 1.683-1.236A6.622 6.622 0 0 0 8.791 3.03a4.53 4.53 0 0 0 .444-1.511h7.788V.316H5.641a2.412 2.412 0 0 0-2.407 2.408v12.649A2.412 2.412 0 0 0 5.64 17.78h21.684a2.413 2.413 0 0 0 2.408-2.407V2.723A2.413 2.413 0 0 0 27.325.317zm.36 4.655a5.488 5.488 0 0 1-1.377-1.014 5.432 5.432 0 0 1-1.051-1.451 3.492 3.492 0 0 1-.319-.988h2.387c.331 0 .63.134.851.355.22.22.355.52.355.851v2.56a3.766 3.766 0 0 1-.847-.313zM4.79 1.872a1.2 1.2 0 0 1 .851-.355h2.387a3.492 3.492 0 0 1-.318.988c-.235.486-.59.991-1.051 1.452-.437.437-.914.779-1.377 1.013-.294.15-.58.25-.847.312V2.724c0-.332.135-.63.355-.852zm0 14.352a1.2 1.2 0 0 1-.355-.851v-2.56c.267.063.553.163.847.313.463.234.94.576 1.377 1.014.46.46.816.965 1.05 1.451.17.35.273.687.32.988H5.64c-.331 0-.63-.135-.85-.355zm23.386 0a1.2 1.2 0 0 1-.851.355h-2.387c.046-.301.15-.64.319-.988.234-.486.59-.99 1.05-1.451.438-.438.914-.78 1.377-1.014.294-.15.58-.25.847-.312v2.559c0 .33-.134.63-.355.85z"
                          ></path>
                          <path
                            d="M12.844 9.08a3.64 3.64 0 1 0 7.28-.001 3.64 3.64 0 0 0-7.28 0zm6.077 0c0 .675-.272 1.28-.714 1.724a2.428 2.428 0 0 1-1.724.714c-.675 0-1.28-.272-1.724-.714a2.428 2.428 0 0 1-.714-1.724c0-.675.272-1.281.714-1.724a2.428 2.428 0 0 1 1.724-.714c.675 0 1.28.272 1.724.714.442.443.714 1.049.714 1.724z"
                          ></path>
                          <circle cx="10.222" cy="5.096" r="1.001"></circle>
                          <circle cx="22.782" cy="13.001" r="1.001"></circle>
                          <path
                            d="M25.21 19.19a1.2 1.2 0 0 1-.851.355H2.675a1.2 1.2 0 0 1-.851-.355 1.2 1.2 0 0 1-.355-.851V5.69c0-.331.134-.63.355-.851a1.2 1.2 0 0 1 .851-.355V3.283A2.413 2.413 0 0 0 .267 5.69v12.65a2.413 2.413 0 0 0 2.408 2.407H24.36a2.413 2.413 0 0 0 2.407-2.408h-1.201c0 .33-.135.63-.355.851z"
                          ></path>
                        </g>
                      </svg>
                      <span class="pay_now">
                        {{ _t('Pay Now') }}
                      </span>
                    </span>
                  </router-link>
                  <!-- <router-link
                    v-else
                    :to="'/carhop' + store + '/' + order._id"
                    class="pay-now-carhop"
                  >
                    <span class="dinefor-paynow">
                      <svg
                        height="21"
                        viewBox="0 0 30 21"
                        width="30"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fill="#FFF" fill-rule="nonzero">
                          <path
                            d="M27.325.316H18.3v1.201h5.43c.05.498.201 1.008.444 1.512a6.63 6.63 0 0 0 1.283 1.777c.524.524 1.098.94 1.683 1.236.462.234.93.391 1.39.465v5.082c-.46.073-.928.23-1.39.465a6.678 6.678 0 0 0-1.683 1.235 6.622 6.622 0 0 0-1.282 1.778 4.537 4.537 0 0 0-.444 1.511H9.235a4.537 4.537 0 0 0-.444-1.511 6.636 6.636 0 0 0-1.283-1.778 6.678 6.678 0 0 0-1.683-1.236 4.766 4.766 0 0 0-1.39-.465v-5.08c.46-.075.929-.232 1.39-.466a6.678 6.678 0 0 0 1.683-1.236A6.622 6.622 0 0 0 8.791 3.03a4.53 4.53 0 0 0 .444-1.511h7.788V.316H5.641a2.412 2.412 0 0 0-2.407 2.408v12.649A2.412 2.412 0 0 0 5.64 17.78h21.684a2.413 2.413 0 0 0 2.408-2.407V2.723A2.413 2.413 0 0 0 27.325.317zm.36 4.655a5.488 5.488 0 0 1-1.377-1.014 5.432 5.432 0 0 1-1.051-1.451 3.492 3.492 0 0 1-.319-.988h2.387c.331 0 .63.134.851.355.22.22.355.52.355.851v2.56a3.766 3.766 0 0 1-.847-.313zM4.79 1.872a1.2 1.2 0 0 1 .851-.355h2.387a3.492 3.492 0 0 1-.318.988c-.235.486-.59.991-1.051 1.452-.437.437-.914.779-1.377 1.013-.294.15-.58.25-.847.312V2.724c0-.332.135-.63.355-.852zm0 14.352a1.2 1.2 0 0 1-.355-.851v-2.56c.267.063.553.163.847.313.463.234.94.576 1.377 1.014.46.46.816.965 1.05 1.451.17.35.273.687.32.988H5.64c-.331 0-.63-.135-.85-.355zm23.386 0a1.2 1.2 0 0 1-.851.355h-2.387c.046-.301.15-.64.319-.988.234-.486.59-.99 1.05-1.451.438-.438.914-.78 1.377-1.014.294-.15.58-.25.847-.312v2.559c0 .33-.134.63-.355.85z"
                          ></path>
                          <path
                            d="M12.844 9.08a3.64 3.64 0 1 0 7.28-.001 3.64 3.64 0 0 0-7.28 0zm6.077 0c0 .675-.272 1.28-.714 1.724a2.428 2.428 0 0 1-1.724.714c-.675 0-1.28-.272-1.724-.714a2.428 2.428 0 0 1-.714-1.724c0-.675.272-1.281.714-1.724a2.428 2.428 0 0 1 1.724-.714c.675 0 1.28.272 1.724.714.442.443.714 1.049.714 1.724z"
                          ></path>
                          <circle cx="10.222" cy="5.096" r="1.001"></circle>
                          <circle cx="22.782" cy="13.001" r="1.001"></circle>
                          <path
                            d="M25.21 19.19a1.2 1.2 0 0 1-.851.355H2.675a1.2 1.2 0 0 1-.851-.355 1.2 1.2 0 0 1-.355-.851V5.69c0-.331.134-.63.355-.851a1.2 1.2 0 0 1 .851-.355V3.283A2.413 2.413 0 0 0 .267 5.69v12.65a2.413 2.413 0 0 0 2.408 2.407H24.36a2.413 2.413 0 0 0 2.407-2.408h-1.201c0 .33-.135.63-.355.851z"
                          ></path>
                        </g>
                      </svg>
                      <span class="pay_now">
                        {{ _t('Update Order') }}
                      </span>
                    </span>
                  </router-link> -->
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
      <span class="not-found">{{ _t('No running order found') }}.</span>
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
    ...mapState('order', ['selectedOrder']),
    ...mapState('carhop', ['limit']),
    ...mapGetters('location', ['_t']),
    ...mapGetters('context', ['store']),
    ...mapGetters('auth', ['waiter', 'carhop']),

    canPay() {
      const isCarhop = this.carhop
      const isWaiter = this.waiter
      return !isCarhop && !isWaiter
    },
    page: {
      get() {
        return this.$store.getters['carhop/page']('in-progress')
      },
      set(page) {
        this.$store.commit('carhop/SET_PAGE', {
          page: page,
          orderStatus: 'in-progress',
        })
      },
    },
  },

  methods: {
    ...mapActions('carhop', ['fetchOrders', 'orderCollected']),
    ...mapActions('order', ['selectedOrderDetails']),
    ...mapActions('deliveryManager', ['printInvoice']),
    orderCollection(orderId) {
      this.orderCollected(orderId).then(() => {
        this.fetchMore(this.page)
      })
    },
    fetchMore(page) {
      this.fetchOrders({ orderStatus: 'in-progress', page: page })
    },
  },
}
</script>
<style lang="sass" scoped>
.carhop-running-orders-wrapper
  padding: 30px

  .carhop-running-orders
    display: block
    height: calc(100vh - 205px)
    overflow: auto
  .pay_now
    a
      display: inherit
    padding-right: 10px
</style>
<style lang="scss" scoped>
@import '@/assets/scss/responsive_table.scss';
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.btn-align-row {
  display: grid;
  width: max-content;
  .pay-now-carhop {
    width: max-content;
  }
  @include responsive(mobile) {
    display: flex;
    flex-flow: column;
    row-gap: 10px;
  }
}
.carhop-running-orders {
  .btn-align-row {
    grid-template-columns: 1fr 1fr 1fr auto;
    margin-left: 5px;
    .carhop-completed {
      margin-right: 40px;
    }
    .carhop-ready- {
      padding-left: 20px;
      @include responsive(mobile) {
        padding-left: unset;
      }
    }
  }
}
.carhop-completed-orders {
  .btn-align-row {
    grid-template-columns: auto auto auto auto;
    grid-column-gap: $px5;
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

@include responsive(mobile) {
  .carhop-running-orders-wrapper {
    padding: 10px;
    font-size: 0.75rem;
  }
  .order-number,
  .item-name {
    font-size: 12px !important;
  }
  .carhop-running-orders-wrapper tr {
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
  .carhop-running-orders-wrapper .carhop-running-orders {
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
    margin-left: 0 !important;
  }
  .button-wrapper > a span.dinefor-paynow {
    margin-left: 0;
  }
}
.responsive-table {
  @extend %responive-tables;
  @include responive-tables('ORDER NO', 'ITEMS', 'AMOUNT', 'STATUS', 'ACTION');
}
</style>
<style>
@media (min-width: 992px) {
  .animate {
    animation-duration: 0.3s;
    -webkit-animation-duration: 0.3s;
    animation-fill-mode: both;
    -webkit-animation-fill-mode: both;
  }
}

@keyframes slideIn {
  0% {
    transform: translateY(1rem);
    opacity: 0;
  }
  100% {
    transform: translateY(0rem);
    opacity: 1;
  }
  0% {
    transform: translateY(1rem);
    opacity: 0;
  }
}

@-webkit-keyframes slideIn {
  0% {
    -webkit-transform: transform;
    -webkit-opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    -webkit-opacity: 1;
  }
  0% {
    -webkit-transform: translateY(1rem);
    -webkit-opacity: 0;
  }
}

.slideIn {
  -webkit-animation-name: slideIn;
  animation-name: slideIn;
}
</style>
