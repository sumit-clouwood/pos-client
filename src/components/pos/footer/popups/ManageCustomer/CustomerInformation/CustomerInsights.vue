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
        <p v-for="notes in customerNotes" :key="notes._id">{{ notes }}</p>
        <a href="#">Show more</a>
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
    <div class="customer-insight-feedback">
      <p>User Feedback :</p>
      <ul class="ullist-feedback">
        <li>
          <a href="#"
            ><span class="black-smile"><img src="img/pos/unhappy.png"/></span
            ><span class="color-smile"
              ><img src="img/pos/unhappy-color.png"/></span
          ></a>
        </li>
        <li>
          <a href="#"
            ><span class="black-smile"
              ><img src="img/pos/unhappy-copy.png"/></span
            ><span class="color-smile"
              ><img src="img/pos/unhappy-copy-color.png"/></span
          ></a>
        </li>
        <li>
          <a href="#"
            ><span class="black-smile"><img src="img/pos/confused.png"/></span
            ><span class="color-smile"
              ><img src="img/pos/confused-color.png"/></span
          ></a>
        </li>
        <li class="active">
          <a href="#"
            ><span class="black-smile"
              ><img src="img/pos/unhappy-copy-2.png"/></span
            ><span class="color-smile"
              ><img src="img/pos/unhappy-copy-2-color.png"/></span
          ></a>
        </li>
        <li>
          <a href="#"
            ><span class="black-smile"><img src="img/pos/happy.png"/></span
            ><span class="color-smile"
              ><img src="img/pos/happy-color.png"/></span
          ></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CustomerInsights',
  computed: {
    ...mapState({
      insight: state =>
        state.customer.customer.customer_list &&
        state.customer.customer.customer_list.insight
          ? state.customer.customer.customer_list.insight
          : false,
    }),
    ...mapState({
      customerNotes: state =>
        state.customer.customer.customer_list &&
        state.customer.customer.customer_list.customer_notes
          ? state.customer.customer.customer_list.customer_notes
          : false,
    }),
    ...mapState({
      birthday: state =>
        state.customer.customer.customer_list
          ? state.customer.customer.customer_list.day +
            ' ' +
            state.customer.customer.customer_list.month +
            ' ' +
            state.customer.customer.customer_list.year
          : false,
    }),
    ...mapState({
      gender: state =>
        state.customer.customer.customer_list &&
        state.customer.customer.customer_list.gender != null
          ? state.customer.customer.customer_list.gender
          : '-',
    }),
  },
}
</script>
