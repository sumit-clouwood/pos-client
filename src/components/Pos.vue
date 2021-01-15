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

export default {
  name: 'Pos',
  computed: {
    ...mapState('category', ['categories', 'scale_data']),
    ...mapState('auth', ['role']),
    ...mapGetters('context', ['store']),
    ...mapGetters('auth', ['carhop', 'waiter']),
  },
  components: {
    Menu,
    Header,
    Content,
    Footer,
    mobileIndex,
  },
  //store private data in component using data

  //data passed to this component by its parent is contained inside props
  props: {
    msg: String,
  },
  methods: {
    populateScaleData(val) {
      console.log('new value', val)
      //this.$store.dispatch('category/setScaleData', val)
    },
  },
  mounted() {
    let self = this
    const input = document.getElementById('ios_scale_value')

    const descriptor = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(input),
      'value'
    )

    Object.defineProperty(input, 'value', {
      set: function(data) {
        self.$store.dispatch('category/setScaleData', data)
        return descriptor.set.apply(this, arguments)
      },
      get: function() {
        return descriptor.get.apply(this)
      },
    })
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
