<template>
  <!-- Modal -->
  <div
    class="modal fade order-item-modal POSItemOptions"
    id="POSOrderItemOptions"
    tabindex="-1"
    role="dialog"
    aria-labelledby="POSOrderItemOptions"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content color-dashboard-background">
        <Header />
        <Content />
        <div class="text-danger pl-30 color-warning" v-show="error">{{ error }}</div>
        <Footer />
      </div>
    </div>
  </div>
  <!-- End Model -->
</template>

<script>
import Header from "./popup/Header.vue";
import Content from "@/components/pos/content/catalog/items/popup/Content.vue";
import Footer from "./popup/Footer.vue";
import { mapState } from "vuex";

export default {
  name: "Popup",
  props: {},
  components: {
    Content,
    Header,
    Footer
  },
  computed: {
    ...mapState("orderForm", ["error"])
  }
};
</script>
<style lang="scss" scoped>
@import "../../../../../../assets/scss/pixels_rem.scss";
@import "../../../../../../assets/scss/variables.scss";
@import "../../../../../../assets/scss/mixins.scss";

.POSItemOptions {
  .modal-body {
    height: auto !important;
    max-height: 460px;
  }
}
</style>
