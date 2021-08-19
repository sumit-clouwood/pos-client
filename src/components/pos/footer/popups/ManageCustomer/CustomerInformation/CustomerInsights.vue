<template>
  <div class="customer-insight">
    <div class="title-cu">
      <h2 class="color-text-invert">{{ _t('Customer Insights') }}</h2>
    </div>
    <div class="dob-customer-insight">
      <ul class="ullist-dob">
        <li class="color-text">
          {{ _t('Birthday') }} : <span>{{ insight.birthday }}</span>
        </li>
        <li class="color-text">
          {{ _t('Age') }} : <span>{{ getAge(insight.birthday) }}</span>
        </li>
        <li class="color-text">
          {{ _t('Gender') }} : <span>{{ insight.gender }}</span>
        </li>
      </ul>
    </div>
    <div class="last-order-wrap">
      <div class="insight-last-order">
        <h3 class="color-text-invert">{{ _t('Last Order') }}</h3>
        <p class="last-order-time color-text">
          {{ convertDatetime(insight.last_order_datetime, timezoneString) }}
        </p>
        <ul class="fav-item-slider" v-if="items">
          <!--<li><img src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/dine-right.png" alt="fav-item" /></li>-->
          <li class="color-text" v-for="(item, index) in items" :key="index">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="insight-last-order" v-if="insight">
        <ul class="ullist-business-slider">
          <li class="color-text-invert">
            {{ _t('Total Business') }}
            <span class="color-text">{{ insight.total_orders }}</span>
          </li>
          <li class="color-text-invert">
            {{ _t('Cancelled') }}
            <span class="color-text">{{ cancelOrders }}</span>
          </li>
        </ul>
        <div class="total-amount-business-slider">
          <p class="color-text-invert">{{ _t('Total Amount') }}</p>
          <h3 class="color-text" v-if="lastOrder">
            {{ lastOrder.currency_code ? lastOrder.currency_code : '' }}
            {{ lastOrder.balance_due }}
          </h3>
        </div>
      </div>
      <div class="insight-last-order">
        <h3 class="color-text-invert">{{ _t('Favorites') }}</h3>
        <p
          class="last-order-details color-text"
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
    <div class="title-cu">{{ _t('Notes') }}:</div>
    <div class="customer-insights-notes">
      <div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th class="color-text-invert">{{ _t('Date') }}</th>
              <th class="color-text-invert">{{ _t('Note') }}</th>
            </tr>
          </thead>
          <tbody id="notes_data" class="color-tables-background">
            <tr v-for="(notes, index) in insight.notes" :key="index">
              <td class="color-text">
                {{ convertDatetime(notes.created_at, timezoneString) }}
              </td>
              <td class="color-text">{{ notes.note }}</td>
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
      <div class="add-btn-wrapper">
        <button
          id="customer-notes-add"
          data-toggle="modal"
          data-target="#admin-popup"
          class="color-text-invert color-main"
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
      cancelOrders: 0,
    }
  },
  mounted() {
    this.getLastOrderDetails(this.insight.last_order)
  },
  props: {
    pastOrders: false,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['timezoneString']),
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
  updated() {
    try {
      $('.last-order-wrap').slick({
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        nextArrow: '<img class="next-btn" src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/next-arrow.png"/>',
        prevArrow: '<img class="back-btn" src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/back-arrow.png"/>',
      })
      $('.last-order-wrap')[0].slick.refresh()
    } catch (e) {}
    // this.props.customerId = customerId
  },
  methods: {
    getAge: function(dob) {
      let now = new Date()
      if (typeof dob != 'undefined' && dob != null) {
        let dobSplit = dob.split('-')
        let born = new Date(dobSplit[0], dobSplit[1] - 1, dobSplit[2])
        let birthday = new Date(
          now.getFullYear(),
          born.getMonth(),
          born.getDate()
        )
        if (now >= birthday) return now.getFullYear() - born.getFullYear()
        else return now.getFullYear() - born.getFullYear() /* - 1*/
      } else return dob
    },

    getLastOrderDetails: function(orderId) {
      if (this.pastOrders.length) {
        this.lastOrder = this.pastOrders.find(order => order._id == orderId)
        this.items =
          typeof this.lastOrder != 'undefined' ? this.lastOrder.items : false
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
<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  .customer-insight {
    #customer-notes-add {
      height: 45px;
      padding: 0 25px;
      width: 100% !important;
    }
  }
  .add-btn-wrapper {
    width: 100% !important;
  }
}
</style>
