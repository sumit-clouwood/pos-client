<template>
  <div class="invoice" id="printarea" v-if="print">
    <iframe
      ref="iframe"
      width="100%"
      frameborder="0"
      @load="windowSizeChanged()"
      :srcdoc="templateHtml"
      v-if="print"
    ></iframe>
  </div>
</template>

<script>
/* global $ hidePayNow */
import { mapState, mapGetters } from "vuex";
export default {
  name: "Invoice",
  props: {},
  computed: {
    ...mapState("checkout", ["print"]),
    ...mapState("context", ["brandId"]),
    ...mapGetters("invoice", ["templateHtml"])
  },
  components: {},
  methods: {
    windowSizeChanged() {
      if (this.$refs.iframe) {
        this.$nextTick(() => {
          this.$refs.iframe.height =
            this.$refs.iframe.contentWindow.document.body.scrollHeight + 1;
          this.doprint();
        });
      }
      this.$store.commit("checkout/PRINT", false);
    },
    doprint() {
      this.$refs.iframe.contentWindow.print();
      if (this.$store.state.order.orderType.OTApi === "call_center") {
        //this.$router.replace({ name: 'DeliveryManagerLive' })
        window.location = process.env.VUE_APP_DELIVERY_MANAGER_URL.replace(
          "{brand_id}",
          this.$store.state.context.brandId
        );
      }
    }
  },
  watch: {
    templateHtml(newVal) {
      if (newVal) {
        this.$store.commit("checkout/PRINT", false);
        this.$store.dispatch("checkout/reset");

        $(".modal-backdrop").remove();
        $("#order-confirmation").hide();
        hidePayNow();
      }
    }
  }
};
</script>
