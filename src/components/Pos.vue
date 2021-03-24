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
