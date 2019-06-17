<template>
  <!-- Add to order popup -->
  <div class="modal fade" id="add-to-order" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">{{ _t('Add to Order') }}</h4>
        </div>
        <div class="modal-body add-to-order">
          <CustomerDeliveryArea :buttons="false" classAccess="addOrders" />
          <!--<div class="error" v-else-if="error">No address found.</div>
          <div class="loading" v-else><Preloader /></div>-->
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              id="cu-add-address"
              data-toggle="modal"
              data-target="#add_address"
              class="btn btn-success btn-large"
              data-dismiss="modal"
              @click="
                setDefaultSettingsGlobalAddUpdate({ nearest_landmark: '' })
              "
            >
              {{ _t('+ Add Address') }}
            </button>
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
              id="cancel-annc"
            >
              {{ _t('Close') }}
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save"
              type="button"
              id="add-customer-btn"
              @click="updateModalSelection('#order-confirmation')"
              data-dismiss="modal"
            >
              {{ _t('+ Add') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Add to order popup -->
</template>

<script>
/* global $ */
import { mapActions, mapGetters, mapState } from 'vuex'
// import Preloader from '@/components/util/Preloader'
import CustomerDeliveryArea from '../CustomerAddress/CustomerDeliveryArea'
export default {
  name: 'SelectCustomerAddress',
  components: {
    CustomerDeliveryArea,
    // Preloader,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('checkoutForm', ['msg']),
  },
  methods: {
    updateModalSelection(modalName) {
      this.updateModalSelectionDelivery(modalName)
      if (this.msg) {
        $('#payment-msg').modal('show')
      }
    },
    ...mapActions('location', ['updateModalSelectionDelivery']),
    ...mapActions('customer', ['setDefaultSettingsGlobalAddUpdate']),
  },
}
</script>
<style scoped>
.loading {
  padding: 30px;
}
</style>
