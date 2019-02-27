<template>
  <!-- Modal -->
  <div
    class="modal fade POSItemOptions"
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
        <Footer />
      </div>
    </div>
  </div>
  <!-- End Model -->
</template>

<script>
import Content from './popup/Content.vue'
import Header from '@/components/pos/content/catalog/items/popup/Header.vue'
import Footer from '@/components/pos/content/catalog/items/popup/Footer.vue'
export default {
  name: 'Popup',
  props: {},
  components: {
    Content,
    Header,
    Footer,
  },
}
</script>
