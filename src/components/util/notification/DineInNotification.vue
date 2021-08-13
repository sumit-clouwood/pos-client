<template>
  <div class="menu-notifications">
    <div class="dropdown">
      <button
        class="btn btn-primary"
        type="button"
        id="dropdownNotifications"
        @click="openNotifications"
      >
        <img src="img/notification.svg" alt="notifications" />
        <span
          class="notification-count"
          v-if="readyItemNotification.length || qrTableNotification.length"
          >{{
            parseInt(readyItemNotification.length) +
              parseInt(qrTableNotification.length)
          }}</span
        >
      </button>
      <ul
        class="dropdown-menu dropdown-menu-right cursor-pointer"
        x-placement="bottom-end"
        v-if="readyItemNotification.length || qrTableNotification.length"
      >
        <li class="notification-header">
          <h4>{{ _t('Notifications') }}</h4>
          <h4 @click="openNotifications">X</h4>
        </li>
        <li v-if="qrTableNotification.length">
          <ul>
            <li
              class="dropdown-item qr-notification"
              v-for="(notificationDetails, key) in qrTableNotification"
              :key="key"
            >
              <div href="javascript:void(0)" class="item_id">
                <div class="order-table-details">
                  <span>
                    {{ _t('Order') }}:
                    <b class="text-capitalize">
                      #{{ notificationDetails.order_no }} (
                      {{
                        LookupData.replaceUnderscoreHyphon(
                          notificationDetails.order_type
                        )
                      }}
                      )
                    </b>
                  </span>
                  <span>
                    {{ _t('Area') }}:
                    <b class="text-capitalize">{{
                      notificationDetails.area
                    }}</b>
                  </span>
                </div>
                <div class="item-served">
                  <i class="item-name-normal text-capitalize"
                    >{{ _t('At table') }} {{ notificationDetails.table_no }}
                    {{ _t('customer') }} {{ notificationDetails.message }}</i
                  >
                  <span v-if="notificationDetails.namespace === 'new_order'">
                    <order-accept-reject
                      :order="notificationDetails.order"
                      orderTable="no"
                    ></order-accept-reject>
                  </span>
                  <span v-else>
                    <button
                      type="button"
                      class="btn btn-danger shadow-btn"
                      @click="notedMsg(notificationDetails)"
                    >
                      {{ _t('Noted') }}
                    </button>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </li>
        <li v-if="readyItemNotification.length">
          <ul>
            <li
              class="dropdown-item qr-notification"
              v-for="(item_details, key) in readyItemNotification"
              :key="key"
            >
              <div href="javascript:void(0)" class="item_id">
                <div class="order-table-details">
                  <span>
                    {{ _t('Order Number: ') }}
                    <b>#{{ item_details.order_no }}</b>
                  </span>
                  <span v-if="item_details.table">
                    {{ _t('Table Number:') }}
                    <b>{{ item_details.table.number }}</b>
                  </span>
                </div>
                <div
                  class="item-served"
                  v-for="item in item_details.item"
                  :key="item.entity_id"
                >
                  <i class="item-name-normal">{{ item.name }}</i>
                  <span>
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="
                        updateItemNotification(item_details, item.entity_id)
                      "
                    >
                      {{ _t('Serve') }}
                    </button>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <ul
        class="dropdown-menu dropdown-menu-right cursor-pointer"
        v-if="!qrTableNotification.length && !readyItemNotification.length"
      >
        <li class="notification-header">
          <h4>{{ _t('Notifications') }}</h4>
          <h4 @click="openNotifications">X</h4>
        </li>
        <li class="dropdown-item">{{ _t('No more ready item') }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import OrderAcceptReject from '@/components/dinein/content/buttons/OrderAcceptReject'

/* global $ */
export default {
  name: 'DineInNotification',
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', ['readyItemNotification', 'qrTableNotification']),
  },
  components: {
    OrderAcceptReject,
  },
  mounted() {
    this.readyItems()
  },
  methods: {
    openNotifications() {
      $('.menu-notifications .dropdown-menu-right').toggleClass('show')
    },
    readyItems() {
      let notifications = localStorage.getItem('ready_item_notification') || []
      if (notifications.length) notifications = JSON.parse(notifications)
      this.$store.commit('dinein/READY_ITEM_NOTIFICATION', notifications)
      this.qrTableNotifications()
      // return notifications
    },
    qrTableNotifications() {
      let notifications = localStorage.getItem('qr_table_notification') || []
      if (notifications.length) notifications = JSON.parse(notifications)
      this.$store.commit('dinein/QR_TABLE_NOTIFICATION', notifications)
      // return notifications
    },
    notedMsg(notifications) {
      let notification = this.qrTableNotification
      let new_items_list = []
      if (!notification.length) return false
      notification.forEach(data => {
        if (data.order_no !== notifications.order_no) {
          new_items_list.push(data)
        }
      })
      // this.qrTableNotification = new_items_list
      this.$store.commit('dinein/QR_TABLE_NOTIFICATION', new_items_list)
      localStorage.setItem(
        'qr_table_notification',
        JSON.stringify(new_items_list)
      )
    },
    updateItemNotification(removeItem, item_id) {
      let notification = this.readyItemNotification
      let new_items_list = []
      if (!notification.length) return false
      notification.forEach(data => {
        if (data.order_no === removeItem.order_no) {
          data.item.forEach(_item => {
            if (_item.entity_id !== item_id) {
              new_items_list.push(data)
            }
          })
        } else {
          new_items_list.push(data)
        }
      })
      // this.readyItemNotification = new_items_list
      this.$store.commit('dinein/READY_ITEM_NOTIFICATION', new_items_list)
      localStorage.setItem(
        'ready_item_notification',
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
  //._notification {
  //  position: absolute;
  //  width: 50%;
  //  left: 50%;
  //  margin-top: 9px;
  //  background: #e7e7e7;
  //  border-radius: 0 5px 0 5px;
  //}
}
.notification-count {
  /*padding-top: 4px;
  background: #f31410;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
  color: #fff;
  top: -10px;
  position: absolute;
  right: -5px;
  height: 30px;
  width: 30px;
  font-size: 16px;
  padding-right: 4px;*/
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
  grid-template-columns: auto 1fr;
  grid-column-gap: 20px;
  .item-name-normal {
    white-space: normal;
  }
  span {
    &:last-child {
      text-align: right;
      justify-content: end;
    }
  }
}
.qr-notification {
  background-color: #ffffff;
  border-bottom: 1px solid #e1e3e6;
  //color: #fff;
  // &:hover {
  //   color: #e3e7f2;
  // }
  .shadow-btn {
    box-shadow: 0px 0px 3px #0000004a;
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
  left: 0;
  @media only screen and (max-width: 599px) {
    transform: translate3d(-247px, 46px, 0px);
    width: 350px;
    left: 51px;
    border: 1px solid #5a5c5f;
  }
  top: 0;
  will-change: transform;
  .dropdown-item {
    padding: 0.6rem 1.5rem 0.6rem 1.5rem;
  }
}
/*.carhop-wrapper {
  ul.dropdown-menu.show {
    @media only screen and (max-width: 599px) {
      transform: translate3d(-300px, 46px, 0px);
    }
  }
}*/
</style>
