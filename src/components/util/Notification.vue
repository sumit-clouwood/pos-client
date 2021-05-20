<template>
  <div class="menu-language">
    <div class="dropdown">
      <button
        class="btn btn-primary dropdown-toggle"
        type="button"
        id="dropdownNotifications"
        data-toggle="dropdown"
      >
        <img src="img/notification.svg" alt="notifications" />
        <i v-if="readyItemNotification.length">
          <span class="notification-count">{{
            readyItemNotification.length
          }}</span>
        </i>
      </button>
      <ul
        class="dropdown-menu dropdown-menu-right cursor-pointer"
        v-if="readyItemNotification.length"
      >
        <li
          class="dropdown-item"
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
              :key="item._id"
            >
              <span>
                <b> {{ item.name }} </b>
              </span>
              <span>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="updateItemNotification(item_details)"
                >
                  {{ _t('Served') }}
                </button>
              </span>
            </div>
          </div>
        </li>
        <li class="divider"></li>
      </ul>
      <ul class="dropdown-menu dropdown-menu-right  ff cursor-pointer" v-else>
        <li class="dropdown-item">{{ _t('No more ready item') }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Notification',
  data() {
    return {
      readyItemNotification: this.ready_items(),
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
  /*updated() {
    this.readyItemNotification = this.ready_items()
  },*/
  methods: {
    ready_items() {
      let notifications = localStorage.getItem('ready_item_notification') || []
      if (notifications.length) notifications = JSON.parse(notifications)
      return notifications
    },
    updateItemNotification(removeItem) {
      let notification = this.readyItemNotification
      let new_items_list = []
      if (!notification.length) return false
      notification.forEach(item => {
        if (
          item.order_no != removeItem.order_no &&
          item.table != removeItem.table
        ) {
          new_items_list.push(item)
        }
      })
      this.readyItemNotification = new_items_list
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
  padding-top: 4px;
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
  padding-right: 4px;
}
.order-table-details,
.item-served {
  display: grid;
  align-items: baseline;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
  span {
    &:last-child {
      text-align: right;
      justify-content: end;
    }
  }
}
</style>
