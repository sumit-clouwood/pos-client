<template>
  <!--Add Address popup-->

  <div class="modal fade" id="add_address" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Add New Address</h4>
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
                  v-for="area in deliveryAreas"
                  :value="area._id"
                  :key="area._id"
                  :data-deliveryarea="area.name"
                  >{{ area.name }}
                </option>
              </select>
              <span class="validation-error" v-if="errors.add_delivery_area">{{
                errors.add_delivery_area
              }}</span>
            </div>
            <div class="mobile-from">
              <label>Location/Branch <span>*</span></label>
              <select
                class="selectpicker"
                v-model="newAddressDetails.location_id"
              >
                <option :value="location_id">
                  {{ locationData.branch_n }}
                </option>
              </select>
              <span class="validation-error" v-if="errors.location">{{
                errors.location
              }}</span>
            </div>
            <div class="alternate-phone-from">
              <label>Building <span>*</span></label>
              <input
                type="text"
                name="building"
                v-model="newAddressDetails.add_building"
              />
              <span class="validation-error" v-if="errors.add_building">{{
                errors.add_building
              }}</span>
            </div>
            <div class="sex-from">
              <label>Street</label>
              <input
                type="text"
                name="street"
                v-model="newAddressDetails.add_street"
              />
            </div>
          </div>
          <div class="col-md-6 right-form add-address-form">
            <div class="landmark">
              <label>Flat Number </label>
              <input
                type="text"
                name="add_flat_number"
                v-model="newAddressDetails.add_flat_number"
              />
            </div>
            <div class="landmark">
              <label>Nearest Landmark</label>
              <input
                type="text"
                name="add_landmark"
                v-model="newAddressDetails.add_landmark"
              />
            </div>
            <div class="dob">
              <label>City <span>*</span></label>
              <select class="selectpicker" v-model="newAddressDetails.add_city">
                <option selected="selected">
                  {{ locationData.city }}
                </option>
              </select>
              <span class="validation-error" v-if="errors.add_city">{{
                errors.add_city
              }}</span>
            </div>
            <div class="customer-group">
              <label>Country <span>*</span></label>
              <select class="selectpicker" v-model="newAddressDetails.country">
                <option :value="locationData.country_id" selected="selected">
                  {{ locationData.country_name }}
                </option>
              </select>
              <span class="validation-error" v-if="errors.country">{{
                errors.country
              }}</span>
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
              v-on:click="checkForm"
            >
              Save Address
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
    <InformationPopup
      :responseInformation="addressCreateStatus"
      :title="addressCreateStatus.message"
    />
  </div>

  <!--End Address popup-->
</template>

<script>
import { mapState, mapActions } from 'vuex'
import InformationPopup from '@/components/pos/content/InformationPopup'
export default {
  name: 'CreateCustomerAddress',
  props: {},
  data() {
    return {
      newAddressDetails: {},
      errors: {},
    }
  },
  components: {
    InformationPopup,
  },
  computed: {
    ...mapState({
      locationData: state => state.location.locationData,
    }),
    ...mapState({
      location_id: state => state.location.location,
    }),
    ...mapState({
      deliveryAreas: state =>
        state.location.deliveryAreas.length
          ? state.location.deliveryAreas
          : false,
    }),
    ...mapState({
      addressCreateStatus: state => state.customer.responseInformation,
    }),
    /*...mapState({
      customerId: state =>
        state.customer.customer_list.length
          ? state.customer.customer_list._id
          : '',
    }),*/
  },
  methods: {
    checkForm: function() {
      this.errors = {}
      this.errors.count = 0
      if (!this.newAddressDetails.add_delivery_area) {
        this.errors.add_delivery_area = 'Delivery area required'
        this.errors.count = 1
      }
      if (!this.newAddressDetails.add_building) {
        this.errors.add_building = 'Building required'
        this.errors.count = 1
      }
      if (!this.newAddressDetails.add_city) {
        this.errors.add_city = 'City required'
        this.errors.count = 1
      }
      if (!this.newAddressDetails.location_id) {
        this.errors.location = 'Location required'
        this.errors.count = 1
      }
      if (!this.newAddressDetails.country) {
        this.errors.country = 'Country required'
        this.errors.count = 1
      }
      if (this.errors.count === 0) {
        this.CreateAddress(this.newAddressDetails)
        if (
          this.customerCreateStatus &&
          this.customerCreateStatus.status == 1
        ) {
          let addAddress = $('#add_address')
          addAddress.modal('toggle')
          $('#information-popup').modal('toggle')
          addAddress.click()
        } else {
          $('#information-popup').modal('toggle')
        }
      }
    },
    getAreaId: function(e) {
      if (e.target.options.selectedIndex > -1) {
        this.newAddressDetails.add_delivery_area = $('.getAreaId')
          .find(':selected')
          .text()
      }
    },
    ...mapActions('customer', ['CreateAddress']),
  },
}
</script>
