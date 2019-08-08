<template>
  <div class="header-main-left color-dashboard-background">
    <HeaderOrderType />
    <!--<div class="header-main-left-time color-main color-text-invert">
      <a role="button" class="cursor-pointer" class="color-text-invert">
        <span class="time">{{ todayTime }}</span>
        <span>{{ todayDate }}</span>
      </a>
    </div>-->
    <div class="change-location color-main color-text-invert">
      <button
              class="popup-btn-save"
              v-if="permitted('brand_settings', 'brand')"
      >
        <a :href="baseurl('delivery')">{{ _t('Change Brand') }}</a>
      </button>
    </div>
  </div>
 </template>

<script>
// import moment from 'moment-timezone'
import HeaderOrderType from '@/components/pos/header/HeaderOrderType'
import { mapGetters } from 'vuex'
export default {
  name: 'Topbar',
  props: {},
  components: {
    HeaderOrderType,
  },
  data() {
    return {
      /*todayDate: moment().format('MMMM Do YYYY'),
      todayTime: moment().format('h:mm:ss a'),*/
    }
  },
  computed: {
    ...mapGetters('location', ['_t', 'permitted']),
  },
  methods: {
    baseurl(link) {
      return window.location.href.replace(
              new RegExp('/pos/delivery-manager/.*'),
              '/' + link
      )
    },
  },
  /*mounted: function() {
    setInterval(() => {
      this.todayTime = moment().format('h:mm:ss a')
    }, 1000)
  },*/
}
</script>

