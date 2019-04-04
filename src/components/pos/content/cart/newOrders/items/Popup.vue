<template>
  <!-- Modal -->
  <div
    class="modal fade order-item-modal POSItemOptions order-popup"
    id="POSOrderItemOptions"
    tabindex="-1"
    role="dialog"
    aria-labelledby="POSItemOptions"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <Header />
        <Content />
        <div class="error" v-show="error">{{ error }}</div>
        <Footer />
      </div>
    </div>
  </div>
  <!-- End Model -->
</template>

<script>
import Header from './popup/Header.vue'
import Content from './popup/Content.vue'
import Footer from './popup/Footer.vue'
import { mapState } from 'vuex'
export default {
  name: 'Popup',
  props: {},
  components: {
    Content,
    Header,
    Footer,
  },
  computed: {
    ...mapState('orderForm', ['error']),
  },
}
</script>
<style lang="sass" scoped>
.POSItemOptions
  .modal-body
    height : auto !important;
    max-height: 460px
</style>
