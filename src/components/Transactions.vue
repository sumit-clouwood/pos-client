<template>
  <div class="transaction-orders">
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
import Header from './transactionorders/Header.vue'
import Content from './transactionorders/Content.vue'
import Footer from './transactionorders/Footer'
import { mapState } from 'vuex'
export default {
  name: 'Pos',
  computed: {
    ...mapState('category', ['categories']),
  },
  components: {
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
