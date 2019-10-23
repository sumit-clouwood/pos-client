<template>
  <div class="carhop-completed-orders-wrapper">
    <div v-if="orders.data.length">
      <div class="carhop-completed-orders">
        <table class="responsive-table">
          <thead>
            <tr>
              <th class="table_header">Order No</th>
              <th class="table_header">Items</th>
              <th class="table_header">Amount</th>
              <th class="table_header text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders.data" :key="order._id">
              <td>
                <span class="in-progress order-number"
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
              <td class="text-center">
                <span class="finished">Completed</span>
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
      <span class="not-found">No orders today.</span>
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
    overflow: hidden

  .pagination-wrapper
    display: block
    overflow: hidden
</style>
<style lang="scss" scoped>
@import '../../../assets/scss/responsive_table.scss';
.responsive-table {
  @extend %responive-tables;
  @include responive-tables('ORDER NO', 'ITEMS', 'AMOUNT', 'STATUS');
}
</style>
