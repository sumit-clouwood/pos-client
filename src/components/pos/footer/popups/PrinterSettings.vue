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
                <option
                  v-for="printer in printerConfig.printers"
                  :key="printer"
                >
                  {{ printer }}
                </option>
              </select>
            </div>
            <div>
              <label>Please Choose</label>
              <label>
                Print in KOT
                <input
                  type="checkbox"
                  v-model="printerSettings.is_kot"
                  name="printcong"
                />
              </label>
            </div>
            <div>
              <label>No of invoices</label>
              <label>
                <select v-model="printerSettings.no_of_copies">
                  <option v-for="i in 10" :key="i">{{ i }}</option>
                </select>
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
export default {
  name: 'PrintingSettings',
  data() {
    return {
      printerSettings:
        localStorage.getItem('printerConfig') != null
          ? JSON.parse(localStorage.getItem('printerConfig'))
          : { printer_type: [], is_kot: false, no_of_copies: 1 },
    }
  },
  computed: {
    ...mapState('invoice', ['printerConfig']),
  },
  mounted() {
    // eslint-disable-next-line no-console
    console.log(localStorage.getItem('printerConfig') == null)
  },
  methods: {
    getAllPrinters() {
      alert('1')
      if (window.PrintHandle != null) {
        window.PrintHandle.GetAllPrinters(function(data) {
          let dataObj = JSON.parse(data)
          this.printers = dataObj.printerlist
        })
      }
    },
    SavePrinterConfig() {
      localStorage.setItem(
        'printerConfig',
        JSON.stringify(this.printerSettings)
      )
      // Code Pane reflects in DIMS WEB APP
      // if (window.PrintHandle != null  && window.PrintHandle.GetAgent() === "Dimspos.App") {
      if (window.PrintHandle != null) {
        window.PrintHandle.SavePrinterPopup(
          String(this.printerSettings.printer_type),
          String(this.printerSettings.no_of_copies),
          this.printerSettings.is_kot ? 'True' : 'False',
          function(data) {
            // eslint-disable-next-line no-console
            console.log(data)
          }
        )
      }
      // eslint-disable-next-line no-console
      console.log(this.printerSettings)
    },
  },
}
</script>
<style scoped>
.printer-setting-wrapper {
  width: 100%;
}
.printer-setting-wrapper > div {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: flex-start;
  align-items: center;
}
</style>
