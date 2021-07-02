<template>
  <form>
    <div class="modal-body form-block color-dashboard-background">
      <div class="row">
        <!--<h5 class="customer-block-info color-text-invert">
          {{ _t('General Details') }}
        </h5>-->
        <div class="left-form">
          <div class="name-from">
            <label class="color-text-invert"
              >{{ _t('Name') }} <span>*</span></label
            >
            <input
              type="text"
              autocomplete="off"
              name="name"
              class="text-width"
              v-model="newCustomerDetails.name"
            />
            <span class="validation-error" v-if="errors.name">{{
              errors.name
            }}</span>
          </div>
        </div>
        <div class="left-form">
          <div class="mobile-from">
            <label class="color-text-invert">
              {{ _t('Phone Number') }}
              <span>*</span>
            </label>
            <input
              type="text"
              autocomplete="off"
              name="phone_number"
              class="text-width"
              @keypress="Num.toNumberOnly($event)"
              v-model="newCustomerDetails.phone_number"
            />
            <span class="validation-error" v-if="errors.phone_number">{{
              errors.phone_number
            }}</span>
          </div>
        </div>
        <div class="left-form">
          <div class="email-from">
            <label class="color-text-invert">
              {{ _t('Email') }}
            </label>
            <input
              type="email"
              autocomplete="off"
              name="email"
              class="text-width"
              v-model="newCustomerDetails.email"
            />
            <span class="validation-error" v-if="errors.email">{{
              errors.email
            }}</span>
          </div>
        </div>
        <div class="left-form" v-if="orderType.OTApi === 'carhop'">
          <div class="email-from">
            <label class="color-text-invert">
              {{ _t('Car Number') }}
            </label>
            <input
              type="text"
              autocomplete="off"
              name="car_number"
              class="text-width"
              v-model="newCustomerDetails.car_number"
            />
            <span class="validation-error" v-if="errors.car_number">{{
              errors.car_number
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
/* eslint-disable max-len */
import { mapState, mapGetters } from 'vuex'

function getWithoutSpaceLength(data) {
  if ($.trim(data).length == 0) {
    return false
  }
  return true
}

/* global $ */
export default {
  name: 'LoyaltyCustomerForm',
  props: {},
  data() {
    return {
      errors: {},
      newCustomerDetails: {
        name: '',
        email: '',
        phone_number: '',
        car_number: '',
      },
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState({
      customer_title: state => state.customer.modalStatus,
      customerCreateStatus: state => state.customer.responseInformation,
      customerId: state => state.customer.customer._id,
    }),
    ...mapState('order', ['orderType']),
  },
  methods: {
    getData() {
      return this.newCustomerDetails
    },
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
        typeof this.newCustomerDetails.email !== 'undefined' &&
        this.newCustomerDetails.email
      ) {
        if (
          this.newCustomerDetails.email != '' &&
          !this.validEmail(this.newCustomerDetails.email)
        ) {
          this.errors.email =
            this._t('Valid email') + ' ' + this._t('is required.')
          this.errors.count = 1
        }
      }
      // if (this.orderType.OTApi === 'carhop') {
      //   if (
      //     !this.newCustomerDetails.car_number ||
      //     !getWithoutSpaceLength(this.newCustomerDetails.car_number)
      //   ) {
      //     this.errors.car_number =
      //       this._t('Car number') + ' ' + this._t('is required')
      //     this.errors.count = 1
      //   }
      // }

      if (
        !this.newCustomerDetails.phone_number ||
        !getWithoutSpaceLength(this.newCustomerDetails.phone_number)
      ) {
        this.errors.phone_number =
          this._t('Mobile number') + ' ' + this._t('is required')
        this.errors.count = 1
      }
      /*const phone_regex = new RegExp(
        // eslint-disable-next-line no-useless-escape
        /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/
      )*/
      return this.errors
    },
    validEmail: function(email) {
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    reset() {
      this.newCustomerDetails.name = null
      this.newCustomerDetails.phone_number = null
      this.newCustomerDetails.email = null
      this.newCustomerDetails.car_number = null
    },
  },
}
</script>
<style scoped lang="css">
.dropdown-content span {
  color: black;
  padding: 6px 16px;
  text-decoration: none;
  display: block;
}

.dropdown span:hover {
  background-color: #ddd;
}
</style>
<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  .getAreaId {
    width: 100% !important;
  }
  .delivery-area-name {
    /deep/ .IZ-select__menu {
      z-index: 999;
    }
  }

  .dropdown-content {
    margin: 0 !important;
    border: none !important;
    background-color: transparent !important;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-height: 100% !important;

    .showItem {
      padding: 0 !important;
      display: grid !important;
      grid-template-columns: 1fr max-content;
      align-items: center;
      background-color: transparent;
      height: 65px;
      padding: 0 20px;
      display: grid;
      grid-template-columns: 1fr max-content;
      align-items: center;
      border-bottom: 1px solid #ccc;
      margin: 0 10px;

      &:last-child {
        border: none !important;
      }
    }
  }
}
</style>
