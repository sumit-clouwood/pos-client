<template>
  <div class="new-pos">
    <Menu />
    <Header />
    <Content />
    <Footer />
    <mobileIndex />
    <div class="hidden-data">
      <input type="hidden" id="ios_scale_value" autocomplete="off" />
    </div>
  </div>
</template>

<i18n>
    {
    "en": {
    "title": "Broccoli POS (En)",
    "body": "Broccoli POS Body (En)"
    },
    "ar": {
    "title": "Broccoli POS (Ar)",
    "body": "Broccoli POS Body (Ar)"
    }
    }
</i18n>

<script>
/* eslint-disable no-console */

import Menu from './pos/Menu.vue'
import Header from './pos/Header.vue'
import Content from './pos/Content.vue'
import Footer from './pos/Footer'
import mobileIndex from './mobileComponents/_mobileIndex.vue'
import { mapState, mapGetters } from 'vuex'
import PosMixin from '@/mixins/Pos'
export default {
  name: 'Pos',
  mixins: [PosMixin],
  computed: {
    ...mapState('category', ['categories', 'scale_data']),
    ...mapState('auth', ['role']),
    ...mapGetters('context', ['store']),
    ...mapGetters('auth', ['carhop', 'waiter']),
    ...mapState({
      currentStoreId: state => state.context.storeId,
    }),
  },
  components: {
    Menu,
    Header,
    Content,
    Footer,
    mobileIndex,
  },
  mounted() {
    setTimeout(() => {
      this.fetchWaitingTime()
    }, 1000 * 5)
  },
  methods: {
    fetchWaitingTime() {
      if (process.env.VUE_APP_SOCKET_DISABLE) {
        return false
      }
      let store = this.currentStoreId
      let scope = this
      // var socket = io('https://websocket-stg.dimspos.com');
      /*let data = {
        brand_id: '5d9f2254d355b82f1543bd82',
        field: 'waiting_time',
        namespace: '5d9f24ac85f9e71d726b65c2',
        new_value: '01:16',
        old_value: '01:15',
        store_id: store,
      }*/
      this.$socket.client.on(
        'store-field-update-channel:App\\Events\\StoreFieldUpdated:' + store,
        function(response) {
          console.log(response.data)
          if (response.data.field === 'waiting_time') {
            //{ waiting_time: data.new_value }
            let time = response.data.new_value
            scope.$store.commit('location/SET_STORE_POS_WAITING_TIME', time)
          }
        }
      )
    },
  },
  //store private data in component using data

  //data passed to this component by its parent is contained inside props
  props: {
    msg: String,
  },
}
</script>
<style scoped>
.user-profile {
  align-self: center;
}
.hidden-data {
  display: none;
}
</style>
