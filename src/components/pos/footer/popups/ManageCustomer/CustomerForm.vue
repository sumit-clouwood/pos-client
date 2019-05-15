<template>
  <div>
    <div class="modal-body row form-block">
      <div class="col-md-6 left-form">
        <div class="name-from">
          <label>Name <span>*</span></label>
          <input type="text" name="name" v-model="newCustomerDetails.name" />
          <span class="validation-error" v-if="errors.name">{{
            errors.name
          }}</span>
        </div>
        <div class="mobile-from">
          <label>Mobile Number <span>*</span></label>
          <input
            type="text"
            name="phone_number"
            v-model="newCustomerDetails.phone_number"
          />
          <span class="validation-error" v-if="errors.phone_number">{{
            errors.phone_number
          }}</span>
        </div>
        <div class="email-from">
          <label>Email <span>*</span></label>
          <input type="email" name="email" v-model="newCustomerDetails.email" />
          <span class="validation-error" v-if="errors.email">{{
            errors.email
          }}</span>
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
              :value="cGroup.name"
              :key="cGroup._id"
            >
              {{ cGroup.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-md-6 right-form">
        <div class="sex-from">
          <label>Gender</label>
          <select class="selectpicker" v-model="newCustomerDetails.gender">
            <option selected="selected" value="male">Male</option>
            <option value="female">Female</option>
            <option value="undisclosed">Undisclosed</option>
          </select>
        </div>
        <div class="alternate-phone-from">
          <label>Alternate Phone Number </label>
          <input
            type="text"
            name="alternate-phone-from"
            v-model="newCustomerDetails.alternative_phone"
          />
        </div>
        <div class="customer-group">
          <label>Date Of Birth <span>*</span></label>
          <div class="right-shift col-md-7">
            <date-dropdown
              min="1920"
              :max="getCurrentYear"
              v-model="newCustomerDetails.birthday"
              months-names=""
            />
            <span class="validation-error" v-if="errors.birthday">{{
              errors.birthday
            }}</span>
          </div>
        </div>
        <!--<div class="name-from">
          <label>Delivery Area <span>*</span></label>
          &lt;!&ndash;<input type="text" name="Name" />&ndash;&gt;
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
          <span class="validation-error" v-if="errors.delivery_area">{{
            errors.delivery_area
          }}</span>
        </div>-->
        <!--<div class="mobile-from">
          <label>Select Location/Branch <span>*</span></label>
          <select class="selectpicker" v-model="newCustomerDetails.location_id">
            <option :value="storeData.brand_id">
              {{ storeData.branch_n }}
            </option>
          </select>
          <span class="validation-error" v-if="errors.location">{{
            errors.location
          }}</span>
        </div>-->
        <!--<div class="alternate-phone-from">
          <label>Building <span>*</span></label>
          <input
            type="text"
            name="building"
            v-model="newCustomerDetails.building"
          />
          <span class="validation-error" v-if="errors.building">{{
            errors.building
          }}</span>
        </div>-->
        <!--<div class="sex-from">
          <label>Street</label>
          <input
            type="text"
            name="street"
            v-model="newCustomerDetails.street"
          />
        </div>-->
        <!--<div class="flat-from">
          <label>Flat Number </label>
          <input
            type="text"
            name="flat_number"
            v-model="newCustomerDetails.flat_number"
          />
        </div>-->
        <!--<div class="customer-group">
          <label>City<span>*</span></label>
          <select class="selectpicker" v-model="newCustomerDetails.city">
            <option selected="selected">
              {{ storeData.city }}
            </option>
          </select>
          <span class="validation-error" v-if="errors.city">{{
            errors.city
          }}</span>
        </div>-->
        <!--<div class="customer-group">
          <label>Country <span>*</span></label>
          <select class="selectpicker" v-model="newCustomerDetails.country">
            <option :value="storeData.country" selected="selected">
              {{ storeData.country }}
            </option>
          </select>
          <span class="validation-error" v-if="errors.country">{{
            errors.country
          }}</span>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DateDropdown from 'vue-date-dropdown'

export default {
  name: 'CustomerForm',
  props: {},
  components: {
    DateDropdown,
  },
  data() {
    return {
      selectedDate: '',
      getCurrentYear: new Date().getFullYear().toString(),
      months:
        'January,February,March,April,May,June,July,August,September,October,November,December',
      newCustomerDetails: { alternative_phone: '', gender: 'male' },
      errors: {},
    }
  },
  computed: {
    ...mapState({
      customerGroup: state =>
        state.customer.customer_group ? state.customer.customer_group : false,
    }),
    ...mapState({
      // storeData: state => state.location.store,
    }),
    /*...mapState({
      location_id: state => state.location.location,
    }),*/
    ...mapState({
      // deliveryAreas: state => state.customer.fetchDeliveryAreas,
    }),
  },
  methods: {
    validate: function() {
      this.errors = {}
      this.errors.count = 0
      if (!this.newCustomerDetails.name) {
        this.errors.name = 'Name required'
        this.errors.count = 1
      }
      if (
        typeof this.newCustomerDetails.email != 'undefined' &&
        !this.validEmail(this.newCustomerDetails.email)
      ) {
        this.errors.email = 'Valid email required.'
        this.errors.count = 1
      }
      if (!this.newCustomerDetails.email) {
        this.errors.email = 'Email required.'
        this.errors.count = 1
      }
      if (!this.newCustomerDetails.phone_number) {
        this.errors.phone_number = 'Mobile number required'
        this.errors.count = 1
      }
      /*if (!this.newCustomerDetails.delivery_area) {
        this.errors.delivery_area = 'Delivery area required'
        this.errors.count = 1
      }*/
      /*if (!this.newCustomerDetails.building) {
        this.errors.building = 'Building required'
        this.errors.count = 1
      }*/
      /*if (!this.newCustomerDetails.city) {
        this.errors.city = 'City required'
        this.errors.count = 1
      }*/
      /*if (!this.newCustomerDetails.location_id) {
        this.errors.location = 'Location required'
        this.errors.count = 1
      }*/
      if (!this.newCustomerDetails.birthday) {
        this.errors.birthday = 'Date of birth required'
        this.errors.count = 1
      }
      /*if (!this.newCustomerDetails.country) {
        this.errors.country = 'Country required'
        this.errors.count = 1
      }*/

      if (this.errors.count === 0) {
        let birthday = this.newCustomerDetails.birthday.split('.')
        this.newCustomerDetails.birthday =
          birthday[2] + '-' + birthday[1] + '-' + birthday[0]
      }

      return this.errors
    },
    getData() {
      return this.newCustomerDetails
    },
    validEmail: function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
  },
}
</script>
<style lang="scss" scoped>
.right-shift {
  right: 14px;
  float: right;
}
</style>
