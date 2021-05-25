<template>
  <div class="main-orders-contacts color-text">
    <div class="main-oreders-title">
      {{ cartType == 'hold' ? _t('Hold Orders') : _t('New Orders') }}
      <DateTimeVue />
    </div>
    <div class="main-oreders-email" v-if="selectedCustomer && online">
      <span class="cursor-pointer color-text" @click="removeSelectedCustomer()">
        X
      </span>
      <p v-if="selectedCustomer.name != ''">
        {{ _t('Name') }} : {{ selectedCustomer.name }}
      </p>
      <div v-if="selectedCustomer.phone_number">
        {{ _t('Phone') }} : {{ selectedCustomer.phone_number }}
      </div>
    </div>
    <div class="main-oreders-email" v-if="offlineCustomer && !online">
      <span class="cursor-pointer color-text" @click="removeSelectedCustomer()">
        X
      </span>
      <p v-if="offlineCustomer.name != ''">
        {{ _t('Name') }} : {{ offlineCustomer.name }}
      </p>
      <div v-if="offlineCustomer.phone_number">
        {{ _t('Phone') }} : {{ offlineCustomer.phone_number }}
      </div>
    </div>
    <div class="main-oreders-buttons" v-if="items.length">
      <!--<div class="orders-button-large" disabled="disable">
        {{ _t('Move Table') }}
      </div>
      <div class="orders-button-large" disabled="disable">
        {{ _t('Split Table') }}
      </div>-->
      <div
        v-if="
          cartType !== 'hold' && orderType.OTApi !== CONST.ORDER_TYPE_CARHOP
        "
        class="orders-button-large color-main color-text"
        @click="hold"
      >
        {{ _t('Hold') }}
      </div>
      <div>
        <div
          class="btn btn-success cartBottomBtn"
          @click="scroll('up')"
          :class="{ visible: showScrollDown }"
        >
          <i aria-hidden="true" class="fa fa-chevron-down"></i>
        </div>
        <div
          class="btn btn-success cartBottomBtn  down"
          @click="scroll('down')"
          :class="{ visible: showScrollUp }"
        >
          <i aria-hidden="true" class="fa fa-chevron-down"></i>
        </div>
      </div>
      <div
        v-if="
          orderType.OTApi === CONST.ORDER_TYPE_TAKEAWAY &&
            enabled(CONST.MODULE_FUTURE_ORDERS)
        "
      >
        <form>
          <datetime
            type="datetime"
            title="Schedule order"
            placeholder="Schedule"
            v-model="getSetDate"
            input-class="btn schedule-input btn-large datepicker-here color-dashboard-background"
            :value-zone="timezoneString"
            :zone="timezoneString"
            :format="{
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            }"
            :phrases="{ ok: 'Continue', cancel: 'No' }"
            :hour-step="1"
            :minute-step="10"
            :min-datetime="minDatetime"
            :max-datetime="maxDatetime"
            :week-start="7"
            :hide-backdrop="false"
            use12-hour
            auto
          >
            <!--<label for="startDate" slot="before">Field Label</label>-->
            <!--<span class="description" slot="after">The field description</span>-->
            <template slot="button-cancel">
              <!--<fa :icon="['far', 'times']"></fa>-->
              <span @click="setFutureDate(false)">{{ _t('No') }}</span>
            </template>
            <template slot="button-confirm">
              <!--<fa :icon="['fas', 'check-circle']"></fa>-->
              <span @click="setFutureDate(true)">{{ _t('Continue') }}</span>
            </template>
          </datetime>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '@/eventBus'
import CheckoutMixin from '@/mixins/Checkout'

import { mapState, mapGetters, mapActions } from 'vuex'
import DateTimeVue from '@/components/util/DateTimeVue'
import moment from 'moment-timezone'
export default {
  name: 'Header',
  mixins: [CheckoutMixin],
  props: {},
  data() {
    return {
      showScrollUp: false,
      showScrollDown: false,
      futureDateTime: '',
      minDatetime: new Date().toISOString(),
      maxDatetime: null,
    }
  },
  components: {
    DateTimeVue,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['items', 'cartType', 'orderType', 'futureOrder']),
    ...mapState('checkoutForm', ['msg']),
    ...mapState('location', ['timezoneString']),
    ...mapState({ selectedCustomer: state => state.customer.customer }),
    ...mapState({ offlineCustomer: state => state.customer.offlineData }),
    ...mapState('sync', ['online']),
    ...mapGetters('modules', ['enabled']),
    getSetDate: {
      get() {
        return this.futureDateTime
      },
      set(datetime) {
        if (datetime !== '' && typeof datetime.type === 'undefined') {
          this.futureDateTime = datetime
          let date_time =
            datetime != ''
              ? moment.utc(datetime).format('YYYY/MM/DD HH:mm')
              : null
          if (date_time) this.$store.commit('order/SET_FUTURE_ORDER', date_time)
        }
      },
    },
  },
  mounted() {
    bus.$on('showScrollCartUp', option => {
      this.showScrollUp = option
    })
    bus.$on('showScrollCartDown', option => {
      this.showScrollDown = option
    })
  },
  updated() {
    if (!this.futureOrder) this.futureDateTime = ''
  },
  methods: {
    setFutureDate(status) {
      if (!status) {
        this.futureDateTime = ''
        this.$store.commit('order/SET_FUTURE_ORDER', false)
      }
    },
    scroll(option) {
      bus.$emit('scroll-cart', option)
    },
    removeSelectedCustomer() {
      this.$store.commit('location/SET_MODAL', '#manage-customer')
      this.$store.dispatch('customer/resetCustomer')
    },

    hold() {
      this.executePayment({ action: 'on-hold' })
    },
    ...mapActions('checkout', ['orderOnHold']),
  },
}
</script>
<style lang="sass" scoped>
.cartBottomBtn
  opacity: 0

  &.visible
    opacity: 1
  &.down
    margin-left: 10px
    -ms-transform: rotate(180deg)
    transform: rotate(180deg)

.hide
  display : none
  .cartBottomBtn
    width: 50px
    -ms-transform: rotate(90deg)
    transform: rotate(90deg)
</style>
