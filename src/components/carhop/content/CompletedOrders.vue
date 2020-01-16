<template>
  <div class="carhop-completed-orders-wrapper">
    <div v-if="orders.data.length">
      <div class="carhop-completed-orders">
        <table class="responsive-table">
          <thead>
            <tr>
              <th class="table_header" style="width: 200px">Order No</th>
              <th class="table_header" style="width: 400px">Items</th>
              <th class="table_header" width="150px">Amount</th>
              <th class="table_header text-center" width="200px">Status</th>
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
              <td>
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
                <div class="button-wrapper">
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
                      {{ _t('Print') }}
                    </button>
                    <div
                      class="dropdown-menu"
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

export default {
  name: 'CompletedOrders',
  props: {
    orders: Object,
  },
  components: {
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

  .paid-amount-msg
    color: #7ac241
</style>
<style lang="scss" scoped>
@import '../../../assets/scss/responsive_table.scss';
.responsive-table {
  @extend %responive-tables;
  @include responive-tables('ORDER NO', 'ITEMS', 'AMOUNT', 'STATUS');
}
</style>
