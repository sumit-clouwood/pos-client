<template>
  <!-- Select Discount  -->
  <div class="modal fade" id="printer-settings" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
              Printer Configuration
            {{ _t('Printer Configuration') }}
          </h4>
        </div>
        <div class="modal-body row printer-settings">
          <form action="/" class="printer-setting-wrapper">
            <div>
              <label>Please Select</label>
              <select v-model="printerSettings.printer_type">
                <option v-for="print in printers.data" :key="print._id">
                  {{ print.name }}
                </option>
              </select>
            </div>
            <div>
              <label>Please Choose</label>
              <label> Print in KOT
                <input type="checkbox" v-model="printerSettings.is_kot" name="printcong" value="print">
              </label>
            </div>
            <div>
              <label>No of invoices</label>
              <label>
                <input type="text" v-model="printerSettings.no_of_copies" name="invoices" value="1">
              </label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              data-dismiss="modal"
              id="discount-save-btn"
              @click="SavePrinterConfig"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End Select Discount -->
</template>
<script>
import { mapState } from 'vuex'
/* global hideModal */
export default {
  name: 'Discount',
  data() {
    return {
      printerSettings: {printer_type: false, is_kot: 0, no_of_copies: 1}
    }
  },
  computed: {
    ...mapState('invoice', ['printers'])
  },
  methods: {
    SavePrinterConfig() {
      localStorage.setItem('printerConfig', JSON.stringify(this.printerSettings))
      // Code Pane reflects in DIMS WEB APP
      // if (window.PrintHandle != null  && window.PrintHandle.GetAgent() === "Dimspos.App") {
      if (window.PrintHandle != null) {
        window.PrintHandle.SavePrinterPopup(this.printerSettings.printer_type, String(this.printerSettings.no_of_copies), this.printerSettings.is_kot, function (data) {
          // eslint-disable-next-line no-console
          console.log(data)
        })
      }
    },
  }
}
</script>
<style scoped>
  .printer-setting-wrapper {
    width: 100%;
  }
  .printer-setting-wrapper > div{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: flex-start;
    align-items: center;
  }
</style>
