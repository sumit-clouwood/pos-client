<template>
  <div
    class="tab-pane fade color-dashboard-background color-text-invert"
    id="nav-contact"
    role="tabpanel"
    aria-labelledby="nav-contact-tab"
  >
    <div>
      <div v-if="modificationDetails.length > 0">
        <div v-for="(record, index) in modificationDetails" :key="index">
          <div class="modification-history">
            <span
              class="font-weight-bold"
              style="width: 100%;  text-align: center; display: inline-block;"
            >
              {{ record.prefix }}
            </span>
          </div>
          <div class="modification-history">
            <span class="font-weight-bold">{{ _t('By') }} : </span>
            <span> {{ record.by }} </span>
          </div>
          <div class="modification-history">
            <span class="font-weight-bold">{{ _t('At') }} : </span>
            <span>
              {{ record.at }}
            </span>
          </div>
          <div class="modification-history" v-if="record.reason">
            <span class="font-weight-bold">{{ record.reasonPrefix }} : </span>
            <span>
              {{ record.reason }}
            </span>
          </div>
          <div class="modification-history" v-if="record.order">
            <span class="font-weight-bold">{{ record.orderPrefix }} : </span>
            <span>{{ record.orderNumber }}</span>
          </div>
          <div v-if="record.orderUpdated">
            <span class="font-weight-bold"> {{ _t('Items removed') }} : </span>
            <span> {{ record.itemsRemoved }} </span>
          </div>
        </div>
      </div>
      <div v-else>
        {{
          _t(
            'Order Have never been cancelled, modified or created as a modification another order'
          )
        }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import DateTime from '@/mixins/DateTime'
import LookupData from '@/plugins/helpers/LookupData'
import * as CONST from '@/constants'

export default {
  name: 'Modifications',
  mixins: [DateTime],
  props: {
    orderDetails: {},
    userDetails: {},
  },
  data() {
    return {
      modification: false,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['timezoneString']),
    modificationDetails() {
      var modification_records = []
      if (typeof this.orderDetails != 'undefined') {
        /* eslint-disable */
        for (var history of this.orderDetails.order_history) {
          var modificationHistory = this.orderDetails.order_history.find(
            item =>
              item.name == CONST.ORDER_HISTORY_TYPE_RECORD_NEW_FROM_MODIFIED
          )
          let modifiedFrom = {}
          if (history.name ===  CONST.ORDER_HISTORY_TYPE_RECORD_NEW_FROM_MODIFIED) {
            modifiedFrom = {
              prefix: this._t(
                'Order has been created as a modification of another order'
              ),
              by: this.getUserName(history.user),
              at: this.convertDatetime(
                modificationHistory.created_at,
                this.timezoneString
              ),
              reasonPrefix: this._t('Modification Reason'), 
              reason: '', //TODO not getting modification reasons in response 
              orderPrefix: this._t('Old Order Number'),
              order: this._t(modificationHistory.param1),
              orderNumber: this._t(modificationHistory.param2),
            }
            modification_records.push(modifiedFrom)
          }

          if (history.name == CONST.ORDER_HISTORY_TYPE_RECORD_UPDATED) {
            modifiedFrom = {
              prefix: this._t('Order has been updated'),
              by: this.getUserName(history.user),
              at: this.convertDatetime(history.created_at, this.timezoneString),
              reasonPrefix: this._t('Updation Reason'),
              reason: this._t(history.param1),
              orderPrefix: this._t('Item(s) removed:'),
              orderUpdated: true,
              itemsRemoved: this.removedItems(history.param2, history.param3),
            }
            modification_records.push(modifiedFrom)
          }
        }
        return modification_records
      }
      return ''
    },
  },
  methods: {
    getUserName(userId) {
      return LookupData.check({
        collection: this.userDetails.users._id,
        matchWith: userId,
        selection: 'name',
      })
    },
    removedItems(oldItems, newItems) {
      let removedItemsArray = oldItems.filter(this.missingItems(newItems))
      return removedItemsArray.map(item => this._t(item.name)).join(', ')
      
    },
    missingItems(newItems) {
      return (previousItem) => {
        return (
          newItems.filter((newItem) => {
            return (
              newItem.entity_id == previousItem.entity_id && newItem.no == previousItem.no
            )
          }).length == 0
        )
      }
    },
  },
}
</script>
