<template>
  <div
    class="tab-pane fade color-dashboard-background color-text-invert"
    id="nav-contact"
    role="tabpanel"
    aria-labelledby="nav-contact-tab"
  >
    <div>
      {{ modificationDetails() }}
      <div v-if="!modification">
        {{
          _t(
            'Order Have never been cancelled, modified or created as a modification another order'
          )
        }}
      </div>
      <div v-else>
        <div class="modification-history">
          <span class="font-weight-bold">
            {{
              _t('Order has been created as a modification of another order')
            }}
          </span>
        </div>
        <br />
        <div class="modification-history">
          <span class="font-weight-bold">{{ _t('By') }} : </span>
          <span> {{ getUserName(modification.user) }} </span>
        </div>
        <div class="modification-history">
          <span class="font-weight-bold">{{ _t('At') }} : </span>
          <span>
            {{ convertDatetime(modification.created_at, timezoneString) }}
          </span>
        </div>
        <div class="modification-history">
          <span class="font-weight-bold">{{ _t('Old Order Number') }} : </span>
          <span> {{ modification.param2 }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import DateTime from '@/mixins/DateTime'
import LookupData from '@/plugins/helpers/LookupData'

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
  },
  methods: {
    modificationDetails() {
      this.modification = this.orderDetails.order_history.find(
        history => typeof history.param2 != 'undefined'
      )
    },
    getUserName(userId) {
      return LookupData.check({
        collection: this.userDetails.users._id,
        matchWith: userId,
        selection: 'name',
      })
    },
  },
}
</script>

<style scoped></style>
