<template>
  <div class="carhop-completed-orders-wrapper">
    <div v-if="orders.data && orders.data.length">
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
                  <template class="text-right">
                    <!--  -->
                    <print-action :orderId="order._id"></print-action>
                  </template>
                  <div class="paid-amount-msg text-left font-weight-bold">
                    <img
                      src="https://d3jjfdwi6rnqlf.cloudfront.net/img/dinein/paid-icon.png"
                      style="width:33px"
                    />
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
import PrintAction from '@/components/util/Action/PrintAction'

export default {
  name: 'CompletedOrders',
  props: {
    orders: Object,
  },
  components: {
    ReadyAction,
    paginate,
    PrintAction,
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
