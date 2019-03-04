<template>
  <div class="customer-insight" v-if="insight">
    <div class="title-cu">
      <h2>Customer Insights</h2>
    </div>
    <div class="last-order-wrap">
      <div class="insight-last-order">
        <h3>LAST ORDER</h3>
        <p class="last-order-time">{{ insight.lastOrderTimeDifference }}</p>
        <p class="last-order-details">{{ insight.favouriteItem }}</p>
      </div>
      <div class="insight-last-order">
        <ul class="ullist-business-slider">
          <li>
            TOTAL BUSINESS <span>{{ insight.total.total_business }}</span>
          </li>
          <li>
            CANCELLED <span>{{ insight.total.total_cancelled }}</span>
          </li>
        </ul>
        <div class="total-amount-business-slider">
          <p>TOTAL AMOUNT</p>
          <h3>AED {{ insight.total.total_amount }}</h3>
        </div>
      </div>
      <div class="insight-last-order">
        <h3>LAST ORDER</h3>
        <ul class="fav-item-slider">
          <li><img src="/img/pos/done.png" alt="fav-item" /></li>
          <li
            v-for="lastOrderItem in insight.lastOrderItems"
            :key="lastOrderItem._id"
          >
            {{ lastOrderItem }}
          </li>
        </ul>
      </div>
    </div>
    <div class="dob-customer-insight">
      <ul class="ullist-dob">
        <li>
          Birthday : <span>{{ birthday }}</span>
        </li>
        <li>Age : <span>24</span></li>
        <li>
          Gender : <span>{{ gender }}</span>
        </li>
      </ul>
    </div>
    <div class="customer-insights-notes">
      <div>
        <p>Notes :</p>
        <p v-for="notes in customerNotes" :key="notes._id">
          {{ notes.message }}
        </p>
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
function getCustomerList(state) {
  return state.customer.customer.customer_list
}

export default {
  name: 'CustomerInsights',
  components: {
    CustomerFeedback,
  },
  // mounted: {
  //   // ready() {
  //   //   $('.last-order-wrap')[0].slick.refresh()
  //   // },
  // },
  computed: {
    ...mapState({
      insight: state =>
        getCustomerList(state) && getCustomerList(state).insight
          ? getCustomerList(state).insight
          : false,
    }),
    ...mapState({
      customerNotes: state =>
        getCustomerList(state) && getCustomerList(state).customer_notes
          ? getCustomerList(state).customer_notes
          : false,
    }),
    ...mapState({
      birthday: state =>
        (typeof getCustomerList(state).day != 'undefined'
          ? getCustomerList(state).day
          : '-') +
        ' ' +
        (typeof getCustomerList(state).month != 'undefined'
          ? getCustomerList(state).month
          : '-') +
        ' ' +
        (typeof getCustomerList(state).year != 'undefined'
          ? getCustomerList(state).year
          : '-'),
    }),
    ...mapState({
      gender: state =>
        getCustomerList(state) && getCustomerList(state).gender != null
          ? getCustomerList(state).gender
          : '-',
    }),
  },
}
</script>