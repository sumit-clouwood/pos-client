<template>
  <!-- Add customer model -->
  <div class="modal fade" id="customer" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Add Customers</h4>
        </div>
        <div class="modal-body row form-block">
          <div class="col-md-6 left-form">
            <div class="name-from">
              <label>Name <span>*</span></label>
              <input
                type="text"
                name="customer_name"
                v-model="newCustomerDetails.customer_name"
              />
              <span class="validation-error">Please enter valid name.</span>
            </div>
            <div class="mobile-from">
              <label>Mobile Number <span>*</span></label>
              <input
                type="text"
                name="mobile_number"
                v-model="newCustomerDetails.mobile_number"
              />
              <span class="validation-error"
                >Mobile number is already exit.</span
              >
            </div>
            <div class="alternate-phone-from">
              <label>Alternate Phone Number </label>
              <input type="text" name="Name" />
            </div>
            <div class="sex-from">
              <label>Sex</label>
              <select class="selectpicker" v-model="newCustomerDetails.gender">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div class="email-from">
              <label>Email </label>
              <input
                type="text"
                name="email"
                v-model="newCustomerDetails.email"
              />
            </div>
            <div class="customer-group">
              <label>Date Of Birth </label>
              <div class="pull-right col-md-7">
                <date-dropdown
                  min="1920"
                  :max="getCurrentYear"
                  v-model="newCustomerDetails.dob"
                  months-names=""
                />
              </div>
            </div>
            <div class="customer-group" v-if="customerGroup">
              <label>Customer Group</label>
              <select
                class="selectpicker"
                v-model="newCustomerDetails.customer_group"
              >
                <!--<option>Select Customer Group</option>-->
                <option
                  v-for="cGroup in customerGroup"
                  :value="cGroup.id"
                  :key="cGroup.id"
                >
                  {{ cGroup.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-6 right-form">
            <div class="name-from">
              <label>Delivery Area <span>*</span></label>
              <!--<input type="text" name="Name" />-->
              <select
                class="selectpicker"
                v-model="newCustomerDetails.delivery_area"
              >
                <option
                  v-for="area in deliveryAreas"
                  :value="area._id"
                  :key="area._id"
                  >{{ area.name }}
                </option>
              </select>
            </div>
            <div class="mobile-from">
              <label>Select Location/Branch </label>
              <select
                class="selectpicker"
                v-model="newCustomerDetails.location_id"
              >
                <option :value="location_id">
                  {{ locationData.branch_n }}
                </option>
              </select>
            </div>
            <div class="alternate-phone-from">
              <label>Building <span>*</span></label>
              <input
                type="text"
                name="building"
                v-model="newCustomerDetails.building"
              />
              <span class="validation-error">Building is already exit.</span>
            </div>
            <div class="sex-from">
              <label>Street</label>
              <input
                type="text"
                name="street"
                v-model="newCustomerDetails.street"
              />
            </div>
            <div class="email-from">
              <label>Flat Number </label>
              <input
                type="text"
                name="flat_number"
                v-model="newCustomerDetails.flat_number"
              />
            </div>
            <div class="customer-group">
              <label>City</label>
              <select class="selectpicker" v-model="newCustomerDetails.city">
                <option>
                  {{ locationData.city }}
                </option>
              </select>
            </div>
            <div class="customer-group">
              <label>Country</label>
              <select class="selectpicker" v-model="newCustomerDetails.country">
                <option :value="locationData.country_id">
                  {{ locationData.country_name }}
                </option>
              </select>
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
              class="btn btn-success btn-large"
              type="button"
              id="post_announcement"
              v-on:click="CreateCustomer(newCustomerDetails)"
            >
              Save
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End customer Model -->
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DateDropdown from 'vue-date-dropdown'

export default {
  name: 'CreateNewCustomer',
  props: { getCurrentYear: new Date().getFullYear() },
  data() {
    return {
      selectedDate: '',
      months:
        'January,February,March,April,May,June,July,August,September,October,November,December',
      newCustomerDetails: { customer_name: '', mobile_number: '' },
    }
  },
  components: {
    DateDropdown,
  },
  computed: {
    ...mapState({
      customerGroup: state =>
        state.customer.customer_group.length
          ? state.customer.customer_group
          : false,
    }),
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
  },
  methods: {
    ...mapActions('customer', ['CreateCustomer']),
  },
}
</script>
