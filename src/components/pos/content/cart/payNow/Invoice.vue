<template>
  <div class="invoice" id="printarea">
    <iframe
      id="print-iframe"
      ref="iframe"
      width="100%"
      frameborder="0"
      @load="windowSizeChanged()"
      :srcdoc="templateHtml"
    ></iframe>
  </div>
</template>

<script>
/* global $ hidePayNow */
/* eslint-disable no-console */
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
      console.log('window loaded with new content')
      if (this.$refs.iframe) {
        console.log('next tick was called')
        this.$nextTick(() => {
          console.log('changing height of the window')
          try {
            this.$refs.iframe.height =
              this.$refs.iframe.contentWindow.document.body.scrollHeight + 1
          } catch (e) {
            console.log('error occured while changing window height')
          }

          if (this.print) {
            console.log('print singal received')
            this.$store.commit('checkout/PRINT', false)

            try {
              console.log('printing iframe')
              this.$refs.iframe.contentWindow.print()
            } catch (e) {
              document.getElementById('print-iframe').contentWindow.print()

              console.log('print ifrmae error orccured')
              console.log(e)
            }
          }
        })
      }
    },
  },
  watch: {
    print(newVal) {
      if (newVal) {
        console.log('print set')
        if (this.$store.state.order.orderType.OTApi === 'call_center') {
          this.$router.replace({ name: 'DeliveryManager' })
          // window.location = process.env.VUE_APP_DELIVERY_MANAGER_URL.replace(
          //   '{brand_id}',
          //   this.$store.state.context.brandId
          // )
        }
      }
    },
    templateHtml(newVal) {
      if (newVal) {
        console.log('new html arrived for the iframe')

        this.$store.commit('checkout/PRINT', false)
        this.$store.dispatch('checkout/reset')

        $('.modal-backdrop').remove()
        $('#order-confirmation').hide()
        hidePayNow()
      }
    },
  },
}
</script>
<style lang="sass" scoped>
.invoice
  display:none
</style>
