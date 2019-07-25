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
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Invoice',
  props: {},
  computed: {
    ...mapState('checkout', ['print']),
    ...mapState('context', ['brandId']),
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
      this.$store.commit('checkout/PRINT', false)
    },
  },
  watch: {
    print(newval, oldval) {
      if (oldval && !newval) {
        //print was true, then printed and print set to false
        setTimeout(() => {
          this.$store.dispatch('checkout/reset')
        }, 1000)
      } else {
        if (newval) {
          if (this.$store.state.order.orderType.OTApi === 'call_center') {
            this.$router.replace({ name: 'DeliveryManager' })
            // window.location = process.env.VUE_APP_DELIVERY_MANAGER_URL.replace(
            //   '{brand_id}',
            //   this.$store.state.context.brandId
            // )
          }
        }
      }
    },
    templateHtml(newVal) {
      if (newVal) {
        $('.modal-backdrop').remove()
        $('#order-confirmation').hide()
        hidePayNow()
      }
    },
  },
}
</script>
