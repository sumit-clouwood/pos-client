<template>
  <div class="customer-insight">
    <div class="title-cu">
      <h2>{{ _t('Customer Insights') }}</h2>
    </div>
    <div class="dob-customer-insight">
      <ul class="ullist-dob">
        <li>
          {{ _t('Birthday') }} : <span>{{ insight.birthday }}</span>
        </li>
        <li>
          {{ _t('Age') }} : <span>{{ getAge(insight.birthday) }}</span>
        </li>
        <li>
          {{ _t('Gender') }} : <span>{{ insight.gender }}</span>
        </li>
      </ul>
    </div>

    <div>
      <div class="last-order-wrap">
        <div class="insight-last-order">
          <h3>{{ _t('Last Order') }}</h3>
          <p class="last-order-time">
            {{ convertDatetime(insight.last_order_datetime) }}
          </p>
          <ul class="fav-item-slider">
            <!--<li><img src="img/pos/dine-right.png" alt="fav-item" /></li>-->
            <li v-for="(item, index) in items" :key="index">
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="insight-last-order">
          <ul class="ullist-business-slider">
            <li>
              {{ _t('Total Business') }}
              <span>{{ insight.total_orders }}</span>
            </li>
            <li>
              {{ _t('Cancelled') }} <span>{{ cancelOrders }}</span>
            </li>
          </ul>
          <div class="total-amount-business-slider">
            <p>{{ _t('Total Amount') }}</p>
            <h3>{{ lastOrder.currency_code }} {{ lastOrder.balance_due }}</h3>
          </div>
        </div>
        <div class="insight-last-order">
          <h3>{{ _t('Favorites') }}</h3>
          <p
            class="last-order-details"
            v-for="(favItem, key) in insight.favorites"
            :key="key"
          >
            {{
              LookupData.get({
                collection: favoriteItems._id,
                matchWith: favItem.menu_item,
                selection: 'name',
              })
            }}
          </p>
        </div>
      </div>
    </div>
    <div class="title-cu">{{ _t('Notes') }}:</div>
    <div class="customer-insights-notes">
      <div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>{{ _t('Date') }}</th>
              <th>{{ _t('Note') }}</th>
            </tr>
          </thead>
          <tbody id="notes_data">
            <tr v-for="(notes, index) in insight.notes" :key="index">
              <td>{{ convertDatetime(notes.created_at) }}</td>
              <td>{{ notes.note }}</td>
            </tr>
          </tbody>
        </table>
        <!-- <span
          data-toggle="modal"
          class="text-success cursor-pointer"
          data-target="#show-more-notes"
          >Show more</span
        >-->
      </div>
      <div>
        <button
          id="customer-notes-add"
          data-toggle="modal"
          data-target="#admin-popup"
        >
          {{ _t('+ Add') }}
        </button>
      </div>
    </div>
    <CustomerFeedback />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import CustomerFeedback from './CustomerFeedback'
import DateTime from '@/mixins/DateTime'

function getCustomerList(state) {
  return state.customer.customer
}
/* eslint-disable */
export default {
  name: 'CustomerInsights',
  components: {
    CustomerFeedback,
  },
  mixins: [DateTime],
  data() {
    return {
      items: false,
      lastOrder: false,
      cancelOrders: 0
    }
  },
  mounted(){
    this.getLastOrderDetails(this.insight.last_order)
  },
  props: {
    pastOrders: false,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState({
      insight: state =>
        getCustomerList(state) ? getCustomerList(state) : false,
    }),
    ...mapState({
      favoriteItems: state => state.customer.lookups.brand_menu_items,
    }),
    totalPages: function() {
      let totalNotes = this.insight.notes.length
      if (totalNotes <= 10) {
        return 1
      } else {
        return totalNotes / 10
      }
    },
  },
  methods: {
    getAge: function(dob) {
      let now = new Date()
      if(typeof dob != 'undefined') {
        let dobSplit= dob.split('-')
        let born = new Date(dobSplit[0], dobSplit[1] - 1, dobSplit[2])
        let birthday = new Date(
                now.getFullYear(),
                born.getMonth(),
                born.getDate()
        )
        if (now >= birthday) return now.getFullYear() - born.getFullYear()
        else return (now.getFullYear() - born.getFullYear())/* - 1*/
      } else return dob
    },

    getLastOrderDetails: function(orderId) {
      if(this.pastOrders.length) {
        this.lastOrder = this.pastOrders.find(order => order._id == orderId)
        this.items = this.lastOrder.items
      }
    },
    cancelled_orders_count: function() {
      /*return this.insight.orders.reduce((prev, current) => {
        return prev + (current.order_status == 'ORDER_STATUS_CANCELLED' ? 1 : 0)
      }, 0)*/
      this.cancelOrders = 0
    },
  },
}
</script>
<style lang="scss" scoped>
.customer-insights-notes div {
  overflow-y: auto;
  max-height: 190px;
}
.insight-last-order {
    text-align: center;
}

</style>
