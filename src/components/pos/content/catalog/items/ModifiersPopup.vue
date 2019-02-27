<template>
  <!-- Modal -->
  <div
    ref="POSItemOptions"
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
        <Content />
        <Footer />
      </div>
    </div>
  </div>
  <!-- End Model -->
</template>

<script>
import Content from './modifierspopup/Content'
import Header from './modifierspopup/Header'
import Footer from './modifierspopup/Footer'
export default {
  name: 'ModifiersPopup',
  props: {},
  components: {
    Content,
    Header,
    Footer,
  },
}
</script>
