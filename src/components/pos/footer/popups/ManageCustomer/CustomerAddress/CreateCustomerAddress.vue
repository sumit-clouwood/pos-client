<template>
  <!--Add Address popup-->

  <div class="modal fade" id="add_address" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">
            {{ customer_title }} {{ _t('Address') }}
          </h4>
        </div>
        <div class="modal-body row form-block">
          <div class="col-md-6 left-form add-address-form">
            <div class="name-from">
              <label>{{ _t('Delivery Area') }} <span>*</span></label>
              <select
                class="getAreaId"
                @change="getAreaId"
                v-model="newAddressDetails.delivery_area_id"
              >
                <option
                  v-for="area in fetchDeliveryAreas"
                  :value="area._id"
                  :key="area._id"
                  :data-deliveryarea="area.name"
                  >{{ area.name }}
                </option>
              </select>
              <span class="validation-error" v-if="errors.delivery_area_id">{{
                errors.delivery_area_id
              }}</span>
            </div>
            <div class="alternate-phone-from">
              <label>{{ _t('Building/Villa') }} <span>*</span></label>
              <input
                type="text"
                name="building"
                v-model="newAddressDetails.building"
              />
              <span class="validation-error" v-if="errors.building">{{
                errors.building
              }}</span>
            </div>
            <div class="sex-from">
              <label>{{ _t('Street') }} <span>*</span></label>
              <input
                type="text"
                name="street"
                v-model="newAddressDetails.street"
              />
              <span class="validation-error" v-if="errors.street">{{
                errors.street
              }}</span>
            </div>
          </div>
          <div class="col-md-6 right-form add-address-form">
            <div class="landmark">
              <label>{{ _t('Flat Number') }} <span>*</span></label>
              <input
                type="text"
                name="flat_number"
                v-model="newAddressDetails.flat_number"
              />
              <span class="validation-error" v-if="errors.flat_number">{{
                errors.flat_number
              }}</span>
            </div>
            <div class="landmark">
              <label>{{ _t('Nearest Landmark') }}</label>
              <input
                type="text"
                name="nearest_landmark"
                v-model="newAddressDetails.nearest_landmark"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save"
              type="button"
              id="save_address"
              v-on:click="checkForm(customer_title)"
            >
              {{ _t('Save Address') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>

  <!--End Address popup-->
</template>

<script>
/* global $ */
import { mapState, mapActions, mapGetters } from 'vuex'
// import InformationPopup from '@/components/pos/content/InformationPopup'
export default {
  name: 'CreateCustomerAddress',
  props: {},
  data() {
    return {
      errors: {},
      add_delivery_area: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState({
      fetchDeliveryAreas: state => state.customer.fetchDeliveryAreas,
      newAddressDetails: state => state.customer.editInformation,
      customer_title: state => state.customer.modalStatus,
      customerCreateStatus: state => state.customer.responseInformation,
      customerId: state => state.customer.customer._id,
    }),
  },
  methods: {
    checkForm: function(modalStatus) {
      this.errors = {}
      this.errors.count = 0
      if (!this.newAddressDetails.delivery_area_id) {
        this.errors.delivery_area_id = 'Delivery area required'
        this.errors.count = 1
      }
      if (!this.newAddressDetails.building) {
        this.errors.building = 'Building/Villa required'
        this.errors.count = 1
      }
      if (this.newAddressDetails.building.length > 15) {
        this.errors.building =
          'Building/Villa should be not more than 15 characters'
        this.errors.count = 1
      }
      if (!this.newAddressDetails.flat_number) {
        this.errors.flat_number = 'Flat Number is required'
        this.errors.count = 1
      }
      if (!this.newAddressDetails.street) {
        this.errors.street = 'Street required'
        this.errors.count = 1
      }
      if (this.newAddressDetails.street.length < 2) {
        this.errors.street = 'Street should be at least 2 characters'
        this.errors.count = 1
      }
      if (this.errors.count === 0) {
        let addAddress = $('#add_address')
        addAddress.modal('toggle')
        // addAddress.click()
        if (modalStatus == 'Add') {
          this.createAction({
            data: this.newAddressDetails,
            model: 'customer_addresses',
            customer: this.customerId,
          })
          addAddress.modal('toggle')
        }
        if (modalStatus == 'Edit') {
          let actionDetails = {
            id: localStorage.getItem('editItemKey'),
            action: 'edit',
            model: 'customer_addresses',
            data: this.newAddressDetails,
          }
          this.updateAction(actionDetails)
          addAddress.modal('toggle')
        }
        /*if (
          this.customerCreateStatus &&
          this.customerCreateStatus.status == 'ok'
        ) {

        } else {
          // $('#information-popup').modal('toggle')
        }*/
      }
    },
    getAreaId: function(e) {
      if (e.target.options.selectedIndex > -1) {
        this.add_delivery_area = $('.getAreaId')
          .find(':selected')
          .text()
      }
    },
    ...mapActions('customer', ['createAction', 'updateAction']),
  },
}
</script>
