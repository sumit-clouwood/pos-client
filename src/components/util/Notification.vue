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
        <span class="notification-count" v-if="readyItemNotification.length">{{
          readyItemNotification.length
        }}</span>
      </button>
      <ul
        class="dropdown-menu dropdown-menu-right cursor-pointer"
        x-placement="bottom-end"
        v-if="readyItemNotification.length"
      >
        <li class="notification-header">
          <h4>{{ _t('Notifications') }}</h4>
          <h4 @click="openNotifications">X</h4>
        </li>
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
              :key="item.entity_id"
            >
              <i class="item-name-normal">{{ item.name }}</i>
              <span>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="updateItemNotification(item_details, item.entity_id)"
                >
                  {{ _t('Serve') }}
                </button>
              </span>
            </div>
          </div>
        </li>
      </ul>
      <ul class="dropdown-menu dropdown-menu-right  ff cursor-pointer" v-else>
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
/* global $ */
export default {
  name: 'Notification',
  /*data() {
    return {
      readyItemNotification: this.ready_items(),
    }
  },*/
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', ['readyItemNotification']),
  },
  /*updated() {
    this.readyItemNotification = this.ready_items()
  },*/
  mounted() {
    this.ready_items()
  },
  methods: {
    openNotifications() {
      /*$('li.dropdown.mega-dropdown a').on('click', function (event) {
        $(this).parent().toggleClass('open');
      });
      // Close notification whe click outside
      $('body').on('click', function (e) {
          if (!$('li.dropdown.mega-dropdown').is(e.target)
              && $('li.dropdown.mega-dropdown').has(e.target).length === 0
              && $('.open').has(e.target).length === 0
          ) {
              $('li.dropdown.mega-dropdown').removeClass('open');
          }
      });
      */
      $('.menu-notifications .dropdown-menu-right').toggleClass('show')
    },
    ready_items() {
      let notifications = localStorage.getItem('ready_item_notification') || []
      if (notifications.length) notifications = JSON.parse(notifications)
      this.$store.commit('dinein/READY_ITEM_NOTIFICATION', notifications)
      // return notifications
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
      this.readyItemNotification = new_items_list
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
  grid-template-columns: 1fr 1fr;
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
