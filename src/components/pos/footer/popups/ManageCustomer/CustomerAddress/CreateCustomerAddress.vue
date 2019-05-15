<template>
  <!--Add Address popup-->

  <div class="modal fade" id="add_address" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">{{ customer_title }} Address</h4>
        </div>
        <div class="modal-body row form-block">
          <div class="col-md-6 left-form add-address-form">
            <div class="name-from">
              <label>Delivery Area <span>*</span></label>
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
              <label>Building/Villa <span>*</span></label>
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
              <label>Street <span>*</span></label>
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
              <label>Flat Number <span>*</span></label>
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
              <label>Nearest Landmark</label>
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
              <span>X</span> Cancel
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save"
              type="button"
              id="save_address"
              v-on:click="checkForm(customer_title)"
            >
              Save Address
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
import { mapState, mapActions } from 'vuex'
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
    ...mapState({
      fetchDeliveryAreas: state => state.customer.fetchDeliveryAreas,
      newAddressDetails: state => state.customer.editInformation,
      customer_title: state => state.customer.modalStatus,
      customerCreateStatus: state => state.customer.responseInformation,
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
        // eslint-disable-next-line no-console
        if (modalStatus == 'Add') {
          this.createAddress(this.newAddressDetails)
        }
        if (modalStatus == 'Edit') {
          let actionDetails = {
            id: localStorage.getItem('editItemKey'),
            action: 'edit',
            model: 'customer_address',
            data: this.newAddressDetails,
          }
          this.updateAction(actionDetails)
        }
        if (
          this.customerCreateStatus &&
          this.customerCreateStatus.status == 'ok'
        ) {
          let addAddress = $('#add_address')
          addAddress.modal('toggle')
          addAddress.click()
        } else {
          // $('#information-popup').modal('toggle')
        }
      }
    },
    getAreaId: function(e) {
      if (e.target.options.selectedIndex > -1) {
        this.add_delivery_area = $('.getAreaId')
          .find(':selected')
          .text()
      }
    },
    ...mapActions('customer', ['createAddress', 'updateAction']),
  },
}
</script>
