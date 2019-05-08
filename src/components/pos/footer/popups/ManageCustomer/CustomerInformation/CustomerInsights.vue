<template>
  <div class="customer-insight">
    {{insight}}
    <div class="title-cu">
      <h2>Customer Insights</h2>
    </div>
<!--    <div>-->
<!--      <carousel :per-page="1" :mouse-drag="false">-->
<!--        <slide>-->
<!--          <div class="insight-last-order">-->
<!--            <h3>LAST ORDER</h3>-->
<!--            <p class="last-order-time">{{ insight.last_order_datetime }}</p>-->
<!--            <p class="last-order-details">{{ insight.favorites   }}</p>-->
<!--          </div>-->
<!--        </slide>-->
<!--        <slide>-->
<!--          <div class="insight-last-order">-->
<!--            <ul class="ullist-business-slider">-->
<!--              <li>-->
<!--                TOTAL BUSINESS <span>{{ insight.total_orders }}</span>-->
<!--              </li>-->
<!--              <li>-->
<!--                CANCELLED <span>{{ cancelled_orders_count }}</span>-->
<!--              </li>-->
<!--            </ul>-->
<!--            <div class="total-amount-business-slider">-->
<!--              <p>TOTAL AMOUNT</p>-->
<!--              <h3>AED {{ insight.total.total_amount }}</h3>-->
<!--            </div>-->
<!--          </div>-->
<!--        </slide>-->
<!--        <slide>-->
<!--          <div class="insight-last-order">-->
<!--            <h3>LAST ORDER</h3>-->
<!--            <ul class="fav-item-slider">-->
<!--              &lt;!&ndash;<li><img src="/img/pos/dine-right.png" alt="fav-item" /></li>&ndash;&gt;-->
<!--              <li>-->
<!--                {{ insight.last_order }}-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->
<!--        </slide>-->
<!--      </carousel>-->
<!--    </div>-->
    <div class="dob-customer-insight">
      <ul class="ullist-dob">
        <li>
          Birthday : <span>{{ insight.birthday }}</span>
        </li>
        <li>Age : <span>24</span></li>
        <li>
          Gender : <span>{{ insight.gender }}</span>
        </li>
      </ul>
    </div>
    <div class="customer-insights-notes">
      <div>
        <p>Notes :</p>
          <paginate
                  v-if="insight.notes.length"
                  :page-count="totalPages"
                  :page-range="1"
                  :margin-pages="1"
                  :prev-text="'Prev'"
                  :next-text="'Next'"
                  :container-class="''"
                  :page-class="'page-item'"
          >
          </paginate>
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
/* global $ */
import { mapState } from 'vuex'
import CustomerFeedback from './CustomerFeedback'
import { Carousel, Slide } from 'vue-carousel'
import paginate from 'vuejs-paginate'

function getCustomerList(state) {
  return state.customer.customer
}

export default {
  name: 'CustomerInsights',
  components: {
    CustomerFeedback,
    Carousel,
    Slide,
    paginate,

  },
  /*data() {
    return {
      orderCount: 3,
    }
  },*/
  mounted() {
    /*$('.br-table-btn').click(function () {
      $('div.last-order-wrap')[0].slick().refresh
    })*/
    /*$('div.last-order-wrap').slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      accessibility: false,
      dots: true,
      arrows: true,
      nextArrow: '<img class="next-btn" src="img/pos/next-arrow.png"/>',
      prevArrow: '<img class="back-btn" src="img/pos/back-arrow.png"/>',
    })*/
  },
  computed: {
    ...mapState({
      insight: state =>
        getCustomerList(state)
          ? getCustomerList(state)
          : false,
    }),
    cancelled_orders_count() {
      return this.insight.orders.reduce((prev, current) => {
        return prev + (current.order_status == 'ORDER_STATUS_CANCELLED' ? 1 : 0)
      }, 0)
    },
    totalPages: function () {
      let totalNotes = this.insight.notes.length
      if(totalNotes <= 10) {
        return 1
      } else {
        return (totalNotes / 10)
      }
    },
    /*...mapState({
      customerNotes: state =>
        getCustomerList(state) && getCustomerList(state).customer_notes
          ? getCustomerList(state).customer_notes
          : false,
    }),*/
    /*...mapState({
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
    }),*/
    /*...mapState({
      gender: state =>
        getCustomerList(state) && getCustomerList(state).gender != null
          ? getCustomerList(state).gender
          : '-',
    }),*/
  },
}
</script>
