<template>
  <div class="invoice" id="printarea">
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
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Invoice',
  props: {},
  computed: {
    ...mapState('checkout', ['print']),
    ...mapGetters('invoice', ['templateHtml']),
  },
  components: {},
  methods: {
    windowSizeChanged() {
      if (this.$refs.iframe) {
        this.$nextTick(() => {
          this.$refs.iframe.height =
            this.$refs.iframe.contentWindow.document.body.scrollHeight + 1
          this.doprint()
        })
      }
    },
    doprint() {
      this.$refs.iframe.contentWindow.print()
    },
  },
  watch: {
    templateHtml(newVal) {
      if (newVal) {
        this.$store.commit('checkout/PRINT', false)
        this.$store.dispatch('checkout/reset')

        // if (this.$store.state.order.orderType.OTApi === 'call_center') {
        //   this.$router.replace({ name: 'DeliveryManagerLive' })
        // }

        $('.modal-backdrop').remove()
        $('#order-confirmation').hide()
        hidePayNow()
      }
    },
  },
}
</script>
