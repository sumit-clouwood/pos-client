<template>
  <div class="transaction-orders">
    <Header />
    <Content />
    <Invoice />
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
import Header from './transactions/Header.vue'
import Content from './transactions/Content.vue'
import Invoice from '@/components/pos/content/cart/payNow/Invoice'
export default {
  name: 'Pos',
  components: {
    Header,
    Content,
    Invoice,
  },
  //store private data in component using data

  //data passed to this component by its parent is contained inside props
  props: {
    msg: String,
  },
}
</script>
