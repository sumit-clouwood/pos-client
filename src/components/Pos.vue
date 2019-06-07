<template>
  <div class="new-pos">
    <Menu v-if="categories.length" />
    <Header />
    <Contents />
    <Footer />
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
import Menu from './pos/Menu.vue'
import Header from './pos/Header.vue'
import Contents from './pos/Contents'
import Footer from './pos/Footer'
import { mapState } from 'vuex'
export default {
  name: 'Pos',
  computed: {
    ...mapState('category', ['categories']),
  },
  components: {
    Menu,
    Header,
    Contents,
    Footer,
  },
  //store private data in component using data

  //data passed to this component by its parent is contained inside props
  props: {
    msg: String,
  },
}
</script>
