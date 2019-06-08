<template>
  <div class="new-pos">
    <Menu v-if="categories.length" />
    <Header />
    <Content />
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
import Content from './pos/Content.vue'
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
    Content,
    Footer,
  },
  //store private data in component using data

  //data passed to this component by its parent is contained inside props
  props: {
    msg: String,
  },
}
</script>
