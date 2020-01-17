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
            <div class="printConfg">
              <label>Please Choose</label>
              <label>
                <input
                  type="checkbox"
                  v-model="printerSettings.is_kot"
                  name="printcong"
                  value="print"
                  id="printcongs"
                />
                <label for="printcongs"></label>
              </label>
            </div>
            <div>
              <label>No of invoices</label>
              <label>
                <input
                  type="text"
                  v-model="printerSettings.no_of_copies"
                  name="invoices"
                  value="1"
                />
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
  name: 'Discount',
  data() {
    return {
      printerSettings: { printer_type: false, is_kot: false, no_of_copies: 1 },
    }
  },
  computed: {
    ...mapState('invoice', ['printers']),
  },
  methods: {
    SavePrinterConfig() {
      localStorage.setItem(
        'printerConfig',
        JSON.stringify(this.printerSettings)
      )
      // Code Pane reflects in DIMS WEB APP
      // if (window.PrintHandle != null  && window.PrintHandle.GetAgent() === "Dimspos.App") {
      if (window.PrintHandle != null) {
        window.PrintHandle.SavePrinterPopup(
          this.printerSettings.printer_type,
          String(this.printerSettings.no_of_copies),
          this.printerSettings.is_kot,
          function(data) {
            // eslint-disable-next-line no-console
            console.log(data)
          }
        )
      }
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
  grid-template-columns: 8rem 1fr;
  justify-content: flex-start;
  align-items: center;
  grid-gap: 3rem;
}
.printer-setting-wrapper select,
.printer-setting-wrapper input {
  width: 100%;
  height: 3.125rem;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #e4e7eb;
  padding: 5px 10px;
}
.printer-setting-wrapper label {
  font-size: 0.875rem;
  line-height: normal;
  letter-spacing: 0.5px;
  color: #72777c;
  vertical-align: middle;
}
.printConfg {
  margin: 1rem 0;
}
/*Checkboxes styles*/
.printer-setting-wrapper input[type='checkbox'] {
  display: none;
}
.printer-setting-wrapper input[type='checkbox'] + label {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 20px;
  font: 14px/20px 'Open Sans', Arial, sans-serif;
  color: #ddd;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.printer-setting-wrapper input[type='checkbox'] + label:before {
  content: '';
  display: block;
  width: 20px;
  height: 20px;
  border: 1px solid #5056ca;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.6;
  -webkit-transition: all 0.12s, border-color 0.08s;
  transition: all 0.12s, border-color 0.08s;
}

.printer-setting-wrapper input[type='checkbox']:checked + label:before {
  width: 10px;
  top: -5px;
  left: 5px;
  border-radius: 0;
  opacity: 1;
  border-top-color: transparent;
  border-left-color: transparent;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
