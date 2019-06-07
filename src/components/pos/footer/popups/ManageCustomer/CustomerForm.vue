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
        <div class="sex-from">
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
          <label>{{ _t('Birthday') }} <span>*</span></label>
          <datetime
            v-model="newCustomerDetails.birthday"
            input-class="btn schedule-input btn-large datepicker-here"
            :phrases="{ ok: _t('Continue'), cancel: _t('Exit') }"
          ></datetime>
          <span class="validation-error" v-if="errors.birthday">{{
            errors.birthday
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Datetime } from 'vue-datetime'

export default {
  name: 'CustomerForm',
  props: {},
  components: {
    Datetime,
  },
  data() {
    return {
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
      customerGroup: state =>
        state.customer.customer_group ? state.customer.customer_group : false,
    }),
  },
  methods: {
    getBirthday: function() {
      if (
        typeof this.newCustomerDetails.birthday != 'undefined' &&
        this.customer_title == 'Edit'
      ) {
        let birthday = this.newCustomerDetails.birthday.split('-')
        this.newCustomerDetails.birthday =
          birthday[0] + '-' + birthday[1] + '-' + birthday[2]
      }
    },
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
      if (!this.newCustomerDetails.birthday) {
        this.errors.birthday = 'Date of birth required'
        this.errors.count = 1
      }
      if (this.errors.count === 0) {
        let birthday = this.newCustomerDetails.birthday.split('T')
        this.newCustomerDetails.birthday = birthday[0]
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
