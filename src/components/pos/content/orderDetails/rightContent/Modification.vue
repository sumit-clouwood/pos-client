<template>
  <div
    class="tab-pane fade color-dashboard-background color-text-invert"
    id="nav-contact"
    role="tabpanel"
    aria-labelledby="nav-contact-tab"
  >
    <div class="order-modif-history">
      <div v-if="modification_records.length">
        <div v-for="(rec, key) in modification_records" :key="key">
          <div>
            <span class="prefix-mr" :class="{ first: key === 0 }">{{
              rec.prefix
            }}</span>
          </div>
          <div>
            <span class="caption-mr">{{ _t('By:') }}</span
            >&nbsp;<span class="value-mr">{{ rec.by }}</span>
          </div>
          <div>
            <span class="caption-mr">{{ _t('At:') }}</span
            >&nbsp;<span class="value-mr">{{ rec.at }}</span>
          </div>
          <div v-if="rec.reason">
            <span class="caption-mr">{{ rec.reason_prefix }}</span
            >&nbsp;<span class="value-mr">{{ rec.reason }}</span>
          </div>
          <div v-if="rec.order_updated">
            <span class="caption-mr">{{ rec.order_prefix }}</span
            >&nbsp;<span class="value-mr">{{ rec.items_removed }}</span>
            <div>
              <span class="caption-mr">{{ rec.order_prefix_add }}</span
              >&nbsp;<span class="value-mr">{{ rec.items_added }}</span>
            </div>
          </div>
          <div v-if="rec.order_created">
            <span class="caption-mr">{{ rec.order_prefix }}</span
            >&nbsp;<span class="value-mr">{{ rec.items_added }}</span>
          </div>

          <div v-if="rec.order">
            <span class="caption-mr">{{ rec.order_prefix }}</span
            >&nbsp;<span
              style="cursor:pointer; text-decoration:underline;"
              class="order value-mr"
              @click="selectedOrderDetails(rec.order)"
              >{{ rec.order_no }}</span
            >
          </div>
        </div>
      </div>
      <div v-else>
        {{
          _t(
            'Order Have never been cancelled, modifier or created as a modification of another order'
          )
        }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import DateTime from '@/mixins/DateTime'
import * as CONST from '@/constants.js'

export default {
  name: 'Modifications',
  mixins: [DateTime],
  props: {},
  data() {
    return {
      modification: false,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['timezoneString']),
    ...mapState({
      collected_data: state => state.order.selectedOrder,
      order: state =>
        state.order.selectedOrder ? state.order.selectedOrder.item : false,
    }),
    modification_records() {
      if (!this.order) return false

      let modification_records = []
      var addedInitialItemsHistory = false
      let from_modified = {}
      let modify_hr = {}

      for (let hr of this.order.order_history) {
        modify_hr = this.order.order_history.find(
          item => item.name == CONST.ORDER_HISTORY_TYPE_RECORD_NEW_FROM_MODIFIED
        )
        if (hr.name == CONST.ORDER_HISTORY_TYPE_RECORD_NEW_FROM_MODIFIED) {
          from_modified = {
            prefix: this._t(
              'Order has been created as a modification of another order'
            ),
            by: this.collected_data.lookups['users']['_id'][modify_hr.user][
              'name'
            ],
            at: this.convertDatetime(modify_hr.created_at, this.timezoneString),
            reason_prefix: '', //TODOIMPR show reason of modification
            reason: '',
            order_prefix: this._t('Old Order Number:'),
            order: modify_hr.param1,
            order_no: modify_hr.param2,
          }
          modification_records.push(from_modified)
        }

        if (hr.name == CONST.ORDER_HISTORY_TYPE_RECORD_UPDATED) {
          if (addedInitialItemsHistory == false) {
            addedInitialItemsHistory = true
            modification_records.push({
              prefix: this._t('Order has been created'),
              by: this.collected_data.lookups['users']['_id'][hr.user]['name'],
              at: this.convertDatetime(hr.created_at, this.timezoneString),
              order_prefix: this._t('Item(s) added:'),
              order_updated: false,
              order_created: true,
              items_added: hr.param2.map(item => this._t(item.name)).join(', '),
            })
          }
          let removed_items = this.removedItems(hr.param2, hr.param3)
          let added_items = this.addedItems(hr.param2, hr.param3)
          from_modified = {
            prefix: this._t('Order has been updated'),
            by: this.collected_data.lookups['users']['_id'][hr.user]['name'],
            at: this.convertDatetime(hr.created_at, this.timezoneString),
            reason_prefix: this._t('Update reason:'),
            reason: hr.param1,
            order_prefix: this._t('Item(s) removed:'),
            order_prefix_add: this._t('Item(s) added:'),
            order_updated: true,
            items_removed: removed_items,
            items_added: added_items,
          }
          modification_records.push(from_modified)
        }
      }
      if (
        this.order.order_system_status == CONST.ORDER_SYSTEM_STATUS_CANCELLED
      ) {
        let cancel_hr = this.order.order_history.find(
          item => item.name == CONST.ORDER_HISTORY_TYPE_RECORD_CANCELLED
        )
        let cancellation_record = {
          prefix: this._t('Order has been cancelled'),
          by: this.collected_data.lookups['users']['_id'][cancel_hr.user][
            'name'
          ],
          at: this.convertDatetime(cancel_hr.created_at, this.timezoneString),
          reason_prefix: this._t('Cancellation Reason:'),
          reason: cancel_hr.param1,
          order_prefix: '',
          order: '',
          order_no: '',
        }
        modification_records.push(cancellation_record)
      }
      if (
        this.order.order_system_status == CONST.ORDER_SYSTEM_STATUS_MODIFIED
      ) {
        modify_hr = this.order.order_history.find(
          item => item.name == CONST.ORDER_HISTORY_TYPE_RECORD_MODIFIED
        )
        let modified_record = {
          type: 'modified',
          prefix: this._t('Order has been modified'),
          by: this.collected_data.lookups['users']['_id'][modify_hr.user][
            'name'
          ],
          at: this.convertDatetime(modify_hr.created_at, this.timezoneString),
          reason_prefix: this._t('Modification Reason:'),
          modification_reason: modify_hr.param1,
          order_prefix: this._t('New Modified Order Number:'),
          order: modify_hr.param2,
          order_no: modify_hr.param3,
        }
        modification_records.push(modified_record)
      }
      return modification_records
    },
  },
  methods: {
    ...mapActions('order', ['selectedOrderDetails']),

    removedItems(oldItemsArray, newItemsArray) {
      let oldItems = oldItemsArray.map(item => {
        return { name: item.name, entity_id: item.entity_id, no: item.no }
      })
      let newItems = newItemsArray.map(item => {
        return { name: item.name, entity_id: item.entity_id, no: item.no }
      })
      let removedItemsArray = oldItems.filter(
        oldItem =>
          !newItems.some(
            newItem => JSON.stringify(newItem) === JSON.stringify(oldItem)
          )
      )
      if (removedItemsArray.length)
        return removedItemsArray.map(item => this._t(item.name)).join(', ')
      else return this._t('Nothing was removed')
    },
    addedItems(oldItemsArray, newItemsArray) {
      let oldItems = oldItemsArray.map(item => {
        return { name: item.name, entity_id: item.entity_id, no: item.no }
      })
      let newItems = newItemsArray.map(item => {
        return { name: item.name, entity_id: item.entity_id, no: item.no }
      })
      let addedItemsArray = newItems.filter(
        newItem =>
          !oldItems.some(
            oldItem => JSON.stringify(oldItem) === JSON.stringify(newItem)
          )
      )
      if (addedItemsArray.length)
        return addedItemsArray.map(item => this._t(item.name)).join(', ')
      else return this._t('Nothing was added')
    },
  },
}
</script>

<style lang="scss" scoped>
#nav-contact {
  max-height: 500px;
  overflow: scroll;
}
.order-modif-history {
  .value-mr,
  .prefix-mr {
    font-weight: bold;
    line-height: 1.5rem;
  }

  .prefix-mr {
    text-transform: uppercase;
    width: 100%;
    text-align: center;
    display: inline-block;
    padding-top: 10px;
    margin-top: 1.5rem;
    &.first {
      padding-top: 0;
    }
  }

  .caption-mr {
    line-height: 1.5rem;
  }
}
</style>
