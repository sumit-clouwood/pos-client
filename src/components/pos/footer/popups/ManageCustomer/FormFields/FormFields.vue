<template>
  <div>
    <input
      v-if="
        field.field_type === 'string' && !drop_downs.includes(field.name_key)
      "
      type="text"
      autocomplete="off"
      v-model="newCustomerDetails[field.name_key]"
      :name="field.name"
    />
    <select
      class="selectpicker"
      v-if="field.name_key === 'gender'"
      v-model="newCustomerDetails.gender"
    >
      <option selected="selected" value="male">{{ _t('Male') }}</option>
      <option value="female">{{ _t('Female') }}</option>
      <option value="undisclosed">{{ _t('Undisclosed') }}</option>
    </select>
    <select
      v-if="field.name_key === 'customer_group'"
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
    <cool-select
      v-if="field.name_key === 'delivery_area_id'"
      class="getAreaId"
      :items="deliveryAreas"
      v-model="newCustomerDetails.delivery_area_id"
    />
    <datetime
      v-if="field.field_type === 'date_picker'"
      input-class="btn schedule-input btn-large datepicker-here"
      :phrases="{ ok: _t('Continue'), cancel: _t('Exit') }"
      v-model="newCustomerDetails.birthday"
    ></datetime>
  </div>
</template>
<script>
/* global $ */
import { Datetime } from 'vue-datetime'
import { mapGetters, mapState } from 'vuex'
import { CoolSelect } from 'vue-cool-select'
export default {
  name: 'FormFields',
  props: { field: Object },
  components: {
    Datetime,
    CoolSelect,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('customer', ['deliveryAreaNames']),
    ...mapState({
      newCustomerDetails: state => state.customer.editInformation,
      customer_title: state => state.customer.modalStatus,
      buildingAreas: state => state.customer.buildingAreas,
      // loyalty: state => state.loyalty.loyalty,
      customerCreateStatus: state => state.customer.responseInformation,
      customerId: state => state.customer.customer._id,
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
      customerGroup: state =>
        state.customer.customer_group ? state.customer.customer_group : false,
    }),
  },
  data() {
    return {
      drop_downs: ['gender', 'customer_group', 'delivery_area_id'],
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
  methods: {
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
    getData() {
      let areaId = this.selectedDeliveryArea.split(', ').join('|')
      return { ...this.newCustomerDetails, delivery_area_id: areaId }
    },
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
    getWithoutSpaceLength(data) {
      return $.trim(data).length !== 0
    },
    validate: function() {
      this.errors = {}
      this.errors.count = 0
      if (
        !this.newCustomerDetails.name ||
        !this.getWithoutSpaceLength(this.newCustomerDetails.name)
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
        !this.getWithoutSpaceLength(this.newCustomerDetails.phone_number)
      ) {
        this.errors.phone_number =
          this._t('Mobile number') + ' ' + this._t('is required')
        this.errors.count = 1
      }
      const phone_regex = new RegExp(
        // eslint-disable-next-line no-useless-escape,max-len
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
          !this.getWithoutSpaceLength(this.newCustomerDetails.building)
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
          !this.getWithoutSpaceLength(this.newCustomerDetails.flat_number)
        ) {
          this.errors.flat_number =
            this._t('Flat Number') + ' ' + this._t('is required')
          this.errors.count = 1
        }
        if (
          !this.newCustomerDetails.nearest_landmark ||
          !this.getWithoutSpaceLength(this.newCustomerDetails.nearest_landmark)
        ) {
          this.errors.nearest_landmark =
            this._t('Landmark') + ' ' + this._t('is required')
          this.errors.count = 1
        }
        if (
          !this.newCustomerDetails.street ||
          !this.getWithoutSpaceLength(this.newCustomerDetails.street)
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
    validEmail: function(email) {
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
  },
}
</script>
