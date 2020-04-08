<template>
  <div class="header-main-left color-dashboard-background">
    <HeaderOrderType />
    <div class="header-main-left-time color-main color-text-invert">
      <a href="javascript:void(0)" class="color-text-invert">
        <span class="time">{{ todayTime }}</span>
        <span><DateTimeVue /></span>
      </a>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import HeaderOrderType from './HeaderOrderType'
import DateTimeVue from '@/components/util/DateTimeVue'

export default {
  name: 'NavSidebar',
  props: {},
  components: {
    HeaderOrderType,
    DateTimeVue,
  },
  data() {
    return {
      todayDate: moment().format('MMMM Do YYYY'),
      todayTime: moment().format('h:mm:ss a'),
    }
  },
  mounted: function() {
    setInterval(() => {
      this.todayTime = moment().format('h:mm:ss a')
    }, 1000)
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
@include responsive(mobile) {
  .transaction-orders
    .header
    .header-main
    .header-main-left
    .header-main-left-time,
  .walkin-btn-design {
    display: none;
  }
}
</style>
