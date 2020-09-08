<template>
  <form>
    <div class="modal-body form-block color-dashboard-background">
      <div
        class="divide-block row"
        v-for="(fields, index) in crm_fields"
        :key="index"
      >
        <h5 class="customer-block-info color-text-invert">
          {{ _t(index.replace(/_/g, ' ')) }}
        </h5>
        <div v-for="(field, key) in fields" :key="key">
          <div class="left-form">
            <div>
              <label v-if="field.name_key !== 'location_coordinates'">
                {{ _t(field.name) }}
                <span v-if="field.mandatory">
                  *
                </span>
              </label>
              <input
                v-if="
                  field.field_type === 'string' &&
                    !drop_downs.includes(field.name_key) &&
                    field.name_key !== 'location_coordinates'
                "
                type="text"
                class="text-width"
                autocomplete="off"
                v-model="newCustomerDetails[field.name_key]"
                v-on:keyup="
                  search(field.name_key, newCustomerDetails[field.name_key])
                "
                :name="field.name"
              />
              <input
                class="text-width"
                v-if="
                  field.field_type === 'numeric' &&
                    !drop_downs.includes(field.name_key)
                "
                type="text"
                autocomplete="off"
                v-model="newCustomerDetails[field.name_key]"
                @keypress="Num.toNumberOnly($event)"
                :name="field.name"
              />
              <div
                class="dropdown"
                v-if="filterBuildingArea && field.name_key === 'building'"
              >
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
              <select
                class="selectpicker"
                v-if="field.name_key === 'gender'"
                v-model="newCustomerDetails.gender"
              >
                <option selected="selected" value="male">{{
                  _t('Male')
                }}</option>
                <option value="female">{{ _t('Female') }}</option>
                <option value="undisclosed">{{ _t('Undisclosed') }}</option>
              </select>
              <select
                v-if="field.name_key === 'customer_group'"
                class="selectpicker text-width"
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
                class="getAreaId text-width"
                :items="deliveryAreas"
                v-model="selectedDeliveryArea"
              />
              <datetime
                v-if="field.field_type === 'date_picker'"
                input-class="btn schedule-input btn-large datepicker-here"
                :phrases="{ ok: _t('Continue'), cancel: _t('Exit') }"
                v-model="newCustomerDetails.birthday"
                class="text-width"
              ></datetime>
              <!--<map-location-selector
                v-if="field.name_key === 'delivery_area_id'"
                :zoom="15"
                :latitude="store.location_coordinates.lat"
                :longitude="store.location_coordinates.lng"
                @locationUpdated="locationUpdated"
              >
              </map-location-selector>-->
              <span
                class="validation-error text-capitalize"
                v-if="errors[field.name_key]"
              >
                {{ errors[field.name_key] }}
              </span>
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
// import mapLocationSelector from 'vue-google-maps-location-selector'

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
    // mapLocationSelector,
  },
  data() {
    return {
      drop_downs: ['gender', 'customer_group', 'delivery_area_id'],
      selectedDeliveryArea: null,
      add_delivery_area: '',
      selectedDate: '',
      latitude: false,
      longitude: false,
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
      crm_fields: state => state.customer.crm_fields,
      mandatory_fields: state => state.customer.mandatory_fields,
      newCustomerDetails: state => state.customer.editInformation,
      customer_title: state => state.customer.modalStatus,
      store: state => state.location.store,
      /*latLng() {
        let lat = this.store.location_coordinates.lat
        let lng = this.store.location_coordinates.lng
        return { lat: lat, lng: lng }
      },*/
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
    /*locationUpdated(latlng) {
      if (this.newCustomerDetails.location_coordinates === null) {
        let location_coordinate = {
          ...this.newCustomerDetails,
          location_coordinates: { lat: latlng.lat, lng: latlng.lng },
        }
        this.$store.commit('customer/SET_EDIT_DETAILS', location_coordinate)
      } else {
        this.newCustomerDetails.location_coordinates.lat = latlng.lat
        this.newCustomerDetails.location_coordinates.lng = latlng.lng
      }
      // eslint-disable-next-line no-console
      console.log(this.latitude, this.longitude)
    },*/
    search(keyName, searchTerm) {
      if (keyName !== 'building') {
        return true
      }
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
      // eslint-disable-next-line no-console
      console.log(this.mandatory_fields)
      this.errors = {}
      this.errors.count = 0
      this.mandatory_fields.forEach(field => {
        if (
          (field === 'phone_number' || field === 'alternative_phone') &&
          $.trim(this.newCustomerDetails[field]).length < 10
        ) {
          this.errors.phone_number =
            this._t('Mobile number') +
            ' ' +
            this._t('is required and it should be at least 10 digits')
          this.errors.count = 1
        }
        if (
          field === 'email' &&
          !this.validEmail(this.newCustomerDetails[field])
        ) {
          this.errors.email =
            this._t('Valid email') + ' ' + this._t('is required.')
          this.errors.count = 1
        }
        if (
          !this.newCustomerDetails[field] ||
          !getWithoutSpaceLength(this.newCustomerDetails[field])
        ) {
          this.errors[field] = this._t(field) + ' ' + this._t('is required')
          this.errors.count = 1
        }
      })

      /*if (this.customer_title !== 'Edit' && this.loyalty !== true) {

      }*/
      if (this.errors.count === 0) {
        if (typeof this.newCustomerDetails.birthday != 'undefined') {
          let birthday = this.newCustomerDetails.birthday.split('T')
          this.newCustomerDetails.birthday = birthday[0]
        }
      }

      return this.errors
    },
    getData() {
      if (this.selectedDeliveryArea) {
        let areaId = this.selectedDeliveryArea.split(', ').join('|')
        return { ...this.newCustomerDetails, delivery_area_id: areaId }
      }
      // eslint-disable-next-line no-console
      /*if (this.newCustomerDetails.location_coordinates.lat === 0) {
        // eslint-disable-next-line max-len
        this.newCustomerDetails.location_coordinates.lat = this.store.location_coordinates.lat
        // eslint-disable-next-line max-len
        this.newCustomerDetails.location_coordinates.lng = this.store.location_coordinates.lng
      }*/
      return { ...this.newCustomerDetails, delivery_area_id: false }
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
<style scoped lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
.map-container {
  height: 14.4rem;
  width: 55.4rem;
  left: 13.5rem;
  top: 10px;
}
.getAreaId {
  display: inline-block !important;
  width: 55.6795rem !important;
}
input {
  width: 21.0875rem !important;
}
.coordinates label {
  padding: unset;
}
.text-width {
  /*width: 20.5vw !important;*/
}
.hidden {
  display: none;
}
input.vdatetime-input.btn.schedule-input.btn-large.datepicker-here {
  width: 100% !important;
}
input.vdatetime-input {
  width: $px342 !important;
}
.coordinates {
  margin-bottom: 22px;
}
#coordinate {
  height: 1.8rem !important;
  width: 2rem !important;
  padding: unset !important;
}
label {
  padding: 0 2rem;
}
/*.validation-error {
  position: absolute;
  width: 100%;
  padding-top: 22px;
  font-size: 14px;
  color: #f44040;
  left: unset;
}*/
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
  width: 96% !important;
  right: 14px;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
  margin-top: 3px;
  max-height: 200px;
  line-height: 1.5rem;
}

.dropdown-content span {
  color: black;
  padding: 10px 2px;
  text-decoration: none;
  display: block;
  border-bottom: 1px solid #dadad6;
  margin: 0px 14px;
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
