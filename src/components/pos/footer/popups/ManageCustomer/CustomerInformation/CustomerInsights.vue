<template>
  <div class="customer-insight">
    <div class="title-cu">
      <h2>Customer Insights</h2>
    </div>
    <div class="dob-customer-insight">
      <ul class="ullist-dob">
        <li>
          Birthday : <span>{{ insight.birthday }}</span>
        </li>
        <li>
          Age : <span>{{ getAge(insight.birthday) }}</span>
        </li>
        <li>
          Gender : <span>{{ insight.gender }}</span>
        </li>
      </ul>
    </div>

    <div>
      <carousel :per-page="1" :mouse-drag="true">
        <slide>
          <div class="insight-last-order">
            <h3>LAST ORDER</h3>
            <p class="last-order-time">
              {{ convertDatetime(insight.last_order_datetime) }}
            </p>
            <ul class="fav-item-slider">
              <!--<li><img src="/img/pos/dine-right.png" alt="fav-item" /></li>-->
              <li v-for="(item, index) in items" :key="index">
                {{ item.name }}
              </li>
            </ul>
          </div>
        </slide>
        <slide>
          <div class="insight-last-order">
            <ul class="ullist-business-slider">
              <li>
                TOTAL BUSINESS <span>{{ insight.total_orders }}</span>
              </li>
              <li>
                CANCELLED <span>{{ cancelOrders }}</span>
              </li>
            </ul>
            <div class="total-amount-business-slider">
              <p>TOTAL AMOUNT</p>
              <h3>AED {{ lastOrder.balance_due }}</h3>
            </div>
          </div>
        </slide>
        <slide>
          <div class="insight-last-order">
            <h3>Favorites</h3>
            <p
              class="last-order-details"
              v-for="(favItem, key) in insight.favorites"
              :key="key"
            >
              {{ getFavItems(favItem.menu_item) }}
            </p>
          </div>
        </slide>
      </carousel>
    </div>
    <div class="customer-insights-notes">
      <div>
        <p>Notes :</p>
        <div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody id="notes_data">
              <tr v-for="(notes, index) in insight.notes" :key="index">
                <td>{{ convertDatetime(notes.created_at) }}</td>
                <td>{{ notes.note }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <span
          data-toggle="modal"
          class="text-success cursor-pointer"
          data-target="#show-more-notes"
          >Show more</span
        >
      </div>
      <div>
        <button
          id="customer-notes-add"
          data-toggle="modal"
          data-target="#admin-popup"
        >
          + Add
        </button>
      </div>
    </div>
    <CustomerFeedback />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CustomerFeedback from './CustomerFeedback'
import { Carousel, Slide } from 'vue-carousel'
import DateTime from '@/mixins/DateTime'

function getCustomerList(state) {
  return state.customer.customer
}
/* eslint-disable */
export default {
  name: 'CustomerInsights',
  components: {
    CustomerFeedback,
    Carousel,
    Slide,
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

    getFavItems: function(favItemId) {
      const favoriteItems = Object.entries(this.favoriteItems._id)
      // eslint-disable-next-line no-console,no-unused-vars
      for (let [key, value] of favoriteItems) {
        if (value._id == favItemId) {
          return value.name
        }
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
.customer-insights-notes div div {
  overflow-y: auto;
  max-height: 190px;
  /*overflow-x: hidden;*/
}
.location-delivery-area-address {
  /*max-height: 250px;*/
}
.insight-last-order {
    text-align: center;
}
.location-delivery-area-address {
    /*max-height: 300px;*/
}
.add-to-order-wrapper {
    /*max-height: 270px;*/
}

</style>
