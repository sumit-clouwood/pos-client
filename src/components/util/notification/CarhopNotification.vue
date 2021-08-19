<template>
  <div class="menu-notifications">
    <div class="dropdown">
      <button
        class="btn btn-primary"
        type="button"
        id="dropdownNotifications"
        @click="openNotifications"
      >
        <img
          src="https://d3jjfdwi6rnqlf.cloudfront.net/img/notification.svg"
          alt="notifications"
        />
        <span class="notification-count" v-if="readyOrderNotification.length">{{
          readyOrderNotification.length
        }}</span>
      </button>
      <ul
        class="dropdown-menu dropdown-menu-right cursor-pointer"
        x-placement="bottom-end"
        v-if="readyOrderNotification.length"
      >
        <li class="notification-header">
          <h4>{{ _t('Notifications') }}</h4>
          <h4 @click="openNotifications">X</h4>
        </li>
        <li
          class="dropdown-item"
          v-for="(order_details, key) in readyOrderNotification"
          :key="key"
        >
          <div href="javascript:void(0)" class="item_id">
            <div class="order-table-details">
              <div class="order-amount">
                <span>
                  {{ _t('Order Number: ') }}
                  <b>#{{ order_details.order_no }}</b>
                </span>
                <span>
                  {{ _t('Amount: ') }}
                  <b> {{ formatPrice(order_details.balance_due) }} </b>
                  <i
                    v-if="parseFloat(order_details.total_paid) < 0.01"
                    class="text-danger"
                  >
                    - {{ _t('Unpaid') }}</i
                  >
                  <i v-else class="text-success"> - {{ _t('Paid') }}</i>
                  <!-- <b>, #{{ order_details.total_paid }}</b>-->
                </span>
              </div>
              <span>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="updateOrderNotification(order_details)"
                >
                  {{ _t('Deliver') }}
                </button>
              </span>
            </div>
          </div>
        </li>
      </ul>
      <ul class="dropdown-menu dropdown-menu-right cursor-pointer" v-else>
        <li class="notification-header">
          <h4>{{ _t('Notifications') }}</h4>
          <h4 @click="openNotifications">X</h4>
        </li>
        <li class="dropdown-item">{{ _t('No more orders') }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { bus } from '@/eventBus'
import { mapGetters, mapState } from 'vuex'
/* global $ */
export default {
  name: 'CarhopNotification',
  computed: {
    ...mapGetters('location', ['_t', 'formatPrice']),
    ...mapState('carhop', ['readyOrderNotification']),
  },
  mounted() {
    let notifications = localStorage.getItem('carhop_order_notification') || []
    if (notifications.length) notifications = JSON.parse(notifications)
    this.$store.commit('carhop/READY_ORDER_NOTIFICATION', notifications)
  },
  methods: {
    openNotifications() {
      bus.$emit('stopCarhopNotificationSound', false)
      $('.menu-notifications .dropdown-menu-right').toggleClass('show')
    },
    updateOrderNotification(removeOrder) {
      let notification = this.readyOrderNotification
      let new_items_list = []
      if (!notification.length) return false
      notification.forEach(data => {
        if (data._id !== removeOrder._id) new_items_list.push(data)
      })
      this.$store.commit('carhop/READY_ORDER_NOTIFICATION', new_items_list)
      localStorage.setItem(
        'carhop_order_notification',
        JSON.stringify(new_items_list)
      )
    },
  },
}
</script>
<style scoped lang="scss">
#dropdownNotifications {
  background-color: #5056ca;
  border-color: #5056ca;
  height: 3.3rem;
  img {
    font-size: 20px;
    color: #fff;
  }
}
.notification-count {
  background: #f31410;
  border-radius: 35%;
  text-align: center;
  font-weight: bold;
  color: #fff;
  top: -10px;
  position: absolute;
  right: -5px;
  height: 22px;
  width: 35px;
  font-size: 16px;
}
.order-table-details,
.item-served {
  display: grid;
  align-items: baseline;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
  .item-name-normal {
    white-space: normal;
  }
  .order-amount {
    display: flex;
    flex-flow: wrap;
  }
  span {
    &:last-child {
      text-align: right;
      justify-content: end;
    }
  }
}
.notification-header {
  left: 0;
  h4 {
    padding: 10px;
  }
  background: #eceaea;
  display: flex;
  justify-content: space-between;
  &:hover {
    background: #eceaea;
  }
}
ul.dropdown-menu.show {
  background: #fff;
  max-height: 500px;
  width: 400px;
  overflow-x: scroll;
  position: absolute;
  z-index: 9;
  transform: translate3d(-353px, 46px, 0px);
  @media only screen and (max-width: 599px) {
    transform: translate3d(-247px, 46px, 0px);
  }
  top: 0;
  left: 0;
  will-change: transform;
  .dropdown-item {
    padding: 0.6rem 1.5rem 0.6rem 1.5rem;
  }
}
.carhop-wrapper {
  ul.dropdown-menu.show {
    @media only screen and (max-width: 599px) {
      transform: translate3d(-300px, 46px, 0px);
    }
  }
}
</style>
