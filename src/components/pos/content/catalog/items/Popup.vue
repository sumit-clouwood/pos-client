<template>
  <!-- Modal -->
  <div
    class="modal fade POSItemOptions"
    id="POSItemOptions"
    tabindex="-1"
    role="dialog"
    aria-labelledby="POSItemOptions"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <Header />
        <HeaderDetails />
        <Content />
        <div class="error" v-show="error">{{ error }}</div>
        <Footer />
      </div>
    </div>
  </div>
  <!-- End Model -->
</template>

<script>
import { mapState } from 'vuex'
import Header from './popup/Header'
import HeaderDetails from './popup/header/HeaderDetails'
import Content from './popup/Content'
import Footer from './popup/Footer'
export default {
  name: 'Popup',
  props: {},
  components: {
    Content,
    Header,
    HeaderDetails,
    Footer,
  },
  computed: {
    ...mapState('orderForm', ['error']),
  },
}
</script>
