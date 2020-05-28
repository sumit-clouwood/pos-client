<template>
  <form>
    <div class="modal-body form-block color-dashboard-background">
      <div class="divide-block row">
        <h5 class="customer-block-info color-text-invert">
          {{ _t('General Details') }}
        </h5>
        <div class="col-md-6 left-form">
          <div class="name-from">
            <label class="color-text-invert"
              >{{ _t('Name') }} <span>*</span></label
            >
            <input
              type="text"
              autocomplete="off"
              name="name"
              v-model="newCustomerDetails.name"
            />
            <span class="validation-error" v-if="errors.name">{{
              errors.name
            }}</span>
          </div>
          <div class="mobile-from">
            <label class="color-text-invert">
              {{ _t('Phone Number') }}
              <span>*</span>
            </label>
            <input
              type="text"
              autocomplete="off"
              name="phone_number"
              @keypress="Num.toNumberOnly($event)"
              v-model="newCustomerDetails.phone_number"
            />
            <span class="validation-error" v-if="errors.phone_number">{{
              errors.phone_number
            }}</span>
          </div>
        </div>
        <div class="col-md-6 right-form">
          <div class="gender">
            <label class="color-text-invert">{{ _t('Gender') }}</label>
            <select class="selectpicker" v-model="newCustomerDetails.gender">
              <option selected="selected" value="male">{{ _t('Male') }}</option>
              <option value="female">{{ _t('Female') }}</option>
              <option value="undisclosed">{{ _t('Undisclosed') }}</option>
            </select>
          </div>
          <div class="email-from nogeneral">
            <label class="color-text-invert">
              {{ _t('Email') }}
            </label>
            <input
              type="email"
              autocomplete="off"
              name="email"
              v-model="newCustomerDetails.email"
            />
            <span class="validation-error" v-if="errors.email">{{
              errors.email
            }}</span>
          </div>
        </div>
      </div>
      <div class="nogeneral">
        <div class="divide-block row">
          <h5 class="customer-block-info color-text-invert">
            {{ _t('Additional Details') }}
          </h5>
          <div class="col-md-6 left-form">
            <div class="alternate-phone-from">
              <label class="color-text-invert"
                >{{ _t('Alt Phone Number') }}
              </label>
              <input
                type="text"
                autocomplete="off"
                name="alternate-phone-from"
                v-model="newCustomerDetails.alternative_phone"
              />
              <span class="validation-error" v-if="errors.alternative_phone">{{
                errors.alternative_phone
              }}</span>
            </div>
          </div>
          <div class="col-md-6 right-form">
            <div class="customer-group">
              <label class="color-text-invert">{{ _t('Birthday') }}</label>
              <datetime
                v-model="newCustomerDetails.birthday"
                input-class="btn schedule-input btn-large datepicker-here"
                :phrases="{ ok: _t('Continue'), cancel: _t('Exit') }"
              ></datetime>
              <!--<span class="validation-error" v-if="errors.birthday">{{
                              errors.birthday
                            }}</span>-->
            </div>
          </div>
          <div class="col-md-12 left-form">
            <div class="customer-group" v-if="customerGroup">
              <label class="color-text-invert">{{
                _t('Customer Group')
              }}</label>
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
        </div>
        <div class="customerAddressWrapper divide-block row">
          <h5 class="customer-block-info color-text-invert">
            {{ _t('Address Details') }}
          </h5>
          <div class="col-md-12 left-form">
            <div class="name-from delivery-area-name">
              <label class="color-text-invert"
                >{{ _t('Delivery Area') }} <span>*</span></label
              >
              <cool-select
                class="getAreaId"
                v-model="selectedDeliveryArea"
                :items="deliveryAreas"
              />
              <span class="validation-error" v-if="errors.delivery_area_id">{{
                errors.delivery_area_id
              }}</span>
            </div>
          </div>
          <div class="col-md-6 left-form">
            <div class="Building">
              <label class="color-text-invert"
                >{{ _t('Building/Villa') }} <span>*</span></label
              >
              <input
                type="text"
                autocomplete="off"
                name="building"
                v-model="newCustomerDetails.building"
                v-on:keyup="search(newCustomerDetails.building)"
              />
              <span class="validation-error" v-if="errors.building">{{
                errors.building
              }}</span>
              <div class="dropdown" v-if="filterBuildingArea">
                <div id="searchDropdown" class="dropdown-content">
                  <span
                    class="showItem color-dashboard-background"
                    v-for="(area, index) in filterBuildingArea"
                    :key="index"
                    v-on:click="selectBuilding(area)"
                  >
                    {{ area }}
                  </span>
                </div>
              </div>
            </div>
            <div class="gender">
              <label class="color-text-invert"
                >{{ _t('Street') }} <span>*</span></label
              >
              <input
                type="text"
                autocomplete="off"
                name="street"
                v-model="newCustomerDetails.street"
              />
              <span class="validation-error" v-if="errors.street">{{
                errors.street
              }}</span>
            </div>
          </div>
          <div class="col-md-6 right-form">
            <div class="landmark">
              <label class="color-text-invert"
                >{{ _t('Flat Number') }} <span>*</span></label
              >
              <input
                type="text"
                autocomplete="off"
                name="flat_number"
                v-model="newCustomerDetails.flat_number"
              />
              <span class="validation-error" v-if="errors.flat_number">{{
                errors.flat_number
              }}</span>
            </div>
            <div class="landmark">
              <label class="color-text-invert"
                >{{ _t('Nearest Landmark') }} <span>*</span></label
              >
              <input
                type="text"
                autocomplete="off"
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
    </div>
  </form>
</template>

<script>
/* eslint-disable max-len */
import { mapState, mapGetters } from 'vuex'
import { Datetime } from 'vue-datetime'
import { CoolSelect } from 'vue-cool-select'

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
    CoolSelect,
  },
  data() {
    return {
      selectedDeliveryArea: null,
      add_delivery_area: '',
      selectedDate: '',
      getCurrentYear: new Date().getFullYear().toString(),
      months:
        'January,February,March,April,May,June,July,August,September,October,November,December',
      errors: {},
      filterBuildingArea: false,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('customer', ['deliveryAreaNames']),
    ...mapState({
      newCustomerDetails: state => state.customer.editInformation,
      customer_title: state => state.customer.modalStatus,
      buildingAreas: state => state.customer.buildingAreas,
      loyalty: state => state.loyalty.loyalty,
      // fetchDeliveryAreas: state => state.customer.fetchDeliveryAreas,

      deliveryAreas() {
        if (this.deliveryAreaNames) {
          let areas = []
          this.deliveryAreaNames.forEach(area => {
            if (area.item_status) {
              areas.push(area.delivery_area)
            }
          })
          return areas
        } else {
          return []
        }
      },

      customerCreateStatus: state => state.customer.responseInformation,
      customerId: state => state.customer.customer._id,
      customerGroup: state =>
        state.customer.customer_group ? state.customer.customer_group : false,
    }),
  },
  methods: {
    search(searchTerm) {
      $('#searchLoader').attr('style', 'display:block')
      $('#searchDropdown').show()
      let searchedItems = []
      if (searchTerm.length > 0) {
        this.buildingAreas.map(item => {
          if (item.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
            searchedItems.push(item)
          }
        })
        this.filterBuildingArea = searchedItems
      } else {
        this.filterBuildingArea = this.buildingAreas
      }
    },
    selectBuilding(selectedArea) {
      this.newCustomerDetails.building = selectedArea
      $('#searchDropdown').hide()
    },
    getAreaId: function(e) {
      if (e.target.options.selectedIndex > -1) {
        this.add_delivery_area = $('.getAreaId')
          .find(':selected')
          .text()
      }
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
        //validate only when email is there

        if (
          this.newCustomerDetails.email != '' &&
          !this.validEmail(this.newCustomerDetails.email)
        ) {
          this.errors.email =
            this._t('Valid email') + ' ' + this._t('is required.')
          this.errors.count = 1
        }
      }
      if (
        !this.newCustomerDetails.phone_number ||
        !getWithoutSpaceLength(this.newCustomerDetails.phone_number)
      ) {
        this.errors.phone_number =
          this._t('Mobile number') + ' ' + this._t('is required')
        this.errors.count = 1
      }
      const phone_regex = new RegExp(
        // eslint-disable-next-line no-useless-escape
        /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/
      )
      if (
        this.newCustomerDetails.phone_number &&
        $.trim(this.newCustomerDetails.phone_number).length < 10
      ) {
        this.errors.phone_number =
          this._t('Mobile number ') +
          ' ' +
          this._t('length should be 10 or more characters')
        this.errors.count = 1
      }

      if (
        this.newCustomerDetails.alternative_phone &&
        ($.trim(this.newCustomerDetails.alternative_phone).length < 10 ||
          !this.newCustomerDetails.alternative_phone.match(phone_regex))
      ) {
        this.errors.alternative_phone =
          this._t('Alternate Mobile number') +
          ' ' +
          this._t('should be correct format and more than 10 chars')
        this.errors.count = 1
      }

      if (this.customer_title !== 'Edit' && this.loyalty !== true) {
        if (!this.selectedDeliveryArea) {
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
      let areaId = this.selectedDeliveryArea.split(', ').join('|')
      /*this.fetchDeliveryAreas.forEach(element => {
        if (this.selectedDeliveryArea === element.name) {
          areaId = element._id
        }
      })*/
      // message: "Excessive field lat_lng_available provided"
      // let customer = {
      //   ...this.newCustomerDetails,
      //   delivery_area_id: areaId,
      //   lat_lng_available: false,
      //   location_coordinates: { lat: 0, lng: 0 },
      // }
      let customer = { ...this.newCustomerDetails, delivery_area_id: areaId }
      return customer
    },
    validEmail: function(email) {
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    reset() {
      this.newCustomerDetails.name = null
      this.newCustomerDetails.phone_number = null
      this.newCustomerDetails.gender = null
      this.newCustomerDetails.email = null
      this.newCustomerDetails.alternative_phone = null
      this.newCustomerDetails.birthday = null
      this.newCustomerDetails.customer_group = null
      this.selectedDeliveryArea = null
      this.newCustomerDetails.building = ''
      this.filterBuildingArea = ''
      this.newCustomerDetails.street = ''
      this.newCustomerDetails.flat_number = ''
      this.newCustomerDetails.nearest_landmark = ''
    },
  },
}
</script>
<style scoped lang="css">
.getAreaId {
  display: inline-block !important;
  width: 55.6795rem !important;
}
.offline .getAreaId {
  width: 60.8795rem !important;
}
.dropdown {
  position: relative;
}

.dropdown-content {
  display: block;
  position: absolute;
  background-color: #f6f6f6;
  width: 57%;
  right: 14px;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
  margin-top: 3px;
  max-height: 200px;
}

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
