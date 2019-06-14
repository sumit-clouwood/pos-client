<template>
  <div>
    <div class="modal-body row form-block">
      <div class="col-md-6 left-form">
        <div class="name-from">
          <label>{{ _t('Name') }} <span>*</span></label>
          <input type="text" name="name" v-model="newCustomerDetails.name" />
          <span class="validation-error" v-if="errors.name">{{
            errors.name
          }}</span>
        </div>
        <div class="mobile-from">
          <label>{{ _t('Phone Number') }} <span>*</span></label>
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
          <label>{{ _t('Email') }} <span>*</span></label>
          <input type="email" name="email" v-model="newCustomerDetails.email" />
          <span class="validation-error" v-if="errors.email">{{
            errors.email
          }}</span>
        </div>
        <div class="customer-group" v-if="customerGroup">
          <label>{{ _t('Customer Group') }}</label>
          <select
            class="selectpicker"
            v-model="newCustomerDetails.customer_group"
          >
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
        <div class="gender">
          <label>{{ _t('Gender') }}</label>
          <select class="selectpicker" v-model="newCustomerDetails.gender">
            <option selected="selected" value="male">{{ _t('Male') }}</option>
            <option value="female">{{ _t('Female') }}</option>
            <option value="undisclosed">{{ _t('Undisclosed') }}</option>
          </select>
        </div>
        <div class="alternate-phone-from">
          <label>{{ _t('Alt Phone Number') }} </label>
          <input
            type="text"
            name="alternate-phone-from"
            v-model="newCustomerDetails.alternative_phone"
          />
        </div>
        <div class="customer-group">
          <label>{{ _t('Birthday') }}</label>
          <datetime
            v-model="newCustomerDetails.birthday"
            input-class="btn schedule-input btn-large datepicker-here"
            :phrases="{ ok: _t('Continue'), cancel: _t('Exit') }"
          ></datetime>
          <!--<span class="validation-error" v-if="errors.birthday">{{
            errors.birthday
          }}</span>-->
        </div>
        <div class="customerAddressWrapper name-from">
          <label>{{ _t('Delivery Area') }} <span>*</span></label>
          <select
            class="getAreaId"
            @change="getAreaId"
            v-model="newCustomerDetails.delivery_area_id"
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
      </div>
      <div class="customerAddressWrapper col-md-6 left-form">
        <div class="alternate-phone-from">
          <label>{{ _t('Building/Villa') }} <span>*</span></label>
          <input
            type="text"
            name="building"
            v-model="newCustomerDetails.building"
          />
          <span class="validation-error" v-if="errors.building">{{
            errors.building
          }}</span>
        </div>
        <div class="gender">
          <label>{{ _t('Street') }} <span>*</span></label>
          <input
            type="text"
            name="street"
            v-model="newCustomerDetails.street"
          />
          <span class="validation-error" v-if="errors.street">{{
            errors.street
          }}</span>
        </div>
      </div>
      <div class="customerAddressWrapper col-md-6 right-form">
        <div class="landmark">
          <label>{{ _t('Flat Number') }} <span>*</span></label>
          <input
            type="text"
            name="flat_number"
            v-model="newCustomerDetails.flat_number"
          />
          <span class="validation-error" v-if="errors.flat_number">{{
            errors.flat_number
          }}</span>
        </div>
        <div class="landmark">
          <label>{{ _t('Nearest Landmark') }} <span>*</span></label>
          <input
            type="text"
            name="nearest_landmark"
            v-model="newCustomerDetails.nearest_landmark"
          />
          <span class="validation-error" v-if="errors.nearest_landmark">{{
            errors.nearest_landmark
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Datetime } from 'vue-datetime'

function getWithoutSpaceLength(data) {
  if ($.trim(data).length == 0) {
    return false
  }
  return true
}

/* global $ */
export default {
  name: 'CustomerForm',
  props: {},
  components: {
    Datetime,
  },
  data() {
    return {
      add_delivery_area: '',
      selectedDate: '',
      getCurrentYear: new Date().getFullYear().toString(),
      months:
        'January,February,March,April,May,June,July,August,September,October,November,December',
      errors: {},
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState({
      newCustomerDetails: state => state.customer.editInformation,
      customer_title: state => state.customer.modalStatus,
      fetchDeliveryAreas: state =>
        state.customer.fetchDeliveryAreas.filter(function(u) {
          if (u.store_id == state.context.storeId) {
            return u.item_status
          }
        }),
      customerCreateStatus: state => state.customer.responseInformation,
      customerId: state => state.customer.customer._id,
      customerGroup: state =>
        state.customer.customer_group ? state.customer.customer_group : false,
    }),
  },
  methods: {
    getAreaId: function(e) {
      if (e.target.options.selectedIndex > -1) {
        this.add_delivery_area = $('.getAreaId')
          .find(':selected')
          .text()
      }
    },
    /*getBirthday: function() {
      if (
        typeof this.newCustomerDetails.birthday != 'undefined' &&
        this.customer_title == 'Edit'
      ) {
        let birthday = this.newCustomerDetails.birthday.split('-')
        this.newCustomerDetails.birthday =
          birthday[0] + '-' + birthday[1] + '-' + birthday[2]
      }
    },*/
    validate: function() {
      this.errors = {}
      this.errors.count = 0
      if (
        !this.newCustomerDetails.name ||
        !getWithoutSpaceLength(this.newCustomerDetails.name)
      ) {
        this.errors.name = this._t('Name') + ' ' + this._t('is required')
        this.errors.count = 1
      }
      if (
        typeof this.newCustomerDetails.email != 'undefined' &&
        !this.validEmail(this.newCustomerDetails.email)
      ) {
        this.errors.email =
          this._t('Valid email') + ' ' + this._t('is required.')
        this.errors.count = 1
      }
      if (
        !this.newCustomerDetails.email ||
        !getWithoutSpaceLength(this.newCustomerDetails.email)
      ) {
        this.errors.email = this._t('Email') + ' ' + this._t('is required.')
        this.errors.count = 1
      }
      if (
        !this.newCustomerDetails.phone_number ||
        !getWithoutSpaceLength(this.newCustomerDetails.phone_number)
      ) {
        this.errors.phone_number =
          this._t('Mobile number') + ' ' + this._t('is required')
        this.errors.count = 1
      }
      if (this.customer_title !== 'Edit') {
        if (!this.newCustomerDetails.delivery_area_id) {
          this.errors.delivery_area_id = this._t('Delivery area required')
          this.errors.count = 1
        }
        if (
          !this.newCustomerDetails.building ||
          !getWithoutSpaceLength(this.newCustomerDetails.building)
        ) {
          this.errors.building = this._t('Building/Villa required')
          this.errors.count = 1
        }
        if (
          this.newCustomerDetails.building &&
          this.newCustomerDetails.building.length > 15
        ) {
          this.errors.building = this._t(
            'Building/Villa should be not more than 15 characters'
          )
          this.errors.count = 1
        }
        if (
          !this.newCustomerDetails.flat_number ||
          !getWithoutSpaceLength(this.newCustomerDetails.flat_number)
        ) {
          this.errors.flat_number =
            this._t('Flat Number') + ' ' + this._t('is required')
          this.errors.count = 1
        }
        if (
          !this.newCustomerDetails.nearest_landmark ||
          !getWithoutSpaceLength(this.newCustomerDetails.nearest_landmark)
        ) {
          this.errors.nearest_landmark =
            this._t('Landmark') + ' ' + this._t('is required')
          this.errors.count = 1
        }
        if (
          !this.newCustomerDetails.street ||
          !getWithoutSpaceLength(this.newCustomerDetails.street)
        ) {
          this.errors.street = this._t('Street') + ' ' + this._t('is required')
          this.errors.count = 1
        }
        if (
          this.newCustomerDetails.street &&
          this.newCustomerDetails.street.length < 2
        ) {
          this.errors.street = this._t('Street should be at least 2 characters')
          this.errors.count = 1
        }
        /*if (!this.newCustomerDetails.birthday) {
              this.errors.birthday = 'Date of birth required'
              this.errors.count = 1
            }*/
      }
      if (this.errors.count === 0) {
        if (typeof this.newCustomerDetails.birthday != 'undefined') {
          let birthday = this.newCustomerDetails.birthday.split('T')
          this.newCustomerDetails.birthday = birthday[0]
        }
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
<!--<style lang="scss" scoped>
.right-shift {
  right: 14px;
  float: right;
}
</style>-->
