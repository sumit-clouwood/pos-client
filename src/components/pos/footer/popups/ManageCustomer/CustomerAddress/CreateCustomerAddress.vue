<template>
  <!--Add Address popup-->

  <div class="modal fade" id="add_address" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">
            {{ customer_title }} {{ _t('Address') }}
          </h4>
        </div>
        <form class="modal-body row form-block">
          <div v-for="(field, key) in fields" :key="key">
            <div v-if="field.item_status">
              <div
                v-if="field.name_key === 'delivery_area_id'"
                class="right-form"
              >
                <div style="display: grid; grid-template-columns: 1fr;">
                  <label>
                    {{ _t(field.name) }}
                    <span v-if="field.mandatory">
                      *
                    </span>
                  </label>
                  <cool-select
                    v-if="field.name_key === 'delivery_area_id'"
                    class="getAreaId text-width"
                    :items="deliveryAreas"
                    v-model="selectedDeliveryArea"
                  />
                </div>
              </div>
              <div v-else class="left-form">
                <div>
                  <label v-if="field.name_key !== 'location_coordinates'">
                    {{ _t(field.name) }}
                    <i
                      class="fa fa-question-circle"
                      aria-hidden="true"
                      v-if="field.field_desc"
                      :title="_t(field.field_desc)"
                    >
                    </i>
                    <span v-if="field.mandatory">
                      *
                    </span>
                  </label>
                  <textarea
                    :maxlength="field.max"
                    :minlength="field.min"
                    id="styled"
                    v-if="field.field_type === 'textarea'"
                    v-model="newAddressDetails[field.name_key]"
                  ></textarea>
                  <input
                    :maxlength="field.max"
                    :minlength="field.min"
                    v-if="
                      field.field_type === 'string' &&
                        !drop_downs.includes(field.name_key)
                    "
                    type="text"
                    class="text-width"
                    autocomplete="off"
                    v-model="newAddressDetails[field.name_key]"
                    v-on:keyup="
                      search(field.name_key, newAddressDetails[field.name_key])
                    "
                    :name="field.name"
                  />
                  <input
                    :maxlength="field.max"
                    :minlength="field.min"
                    class="text-width"
                    v-if="
                      field.field_type === 'numeric' &&
                        !drop_downs.includes(field.name_key)
                    "
                    type="text"
                    autocomplete="off"
                    v-model="newAddressDetails[field.name_key]"
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
                  <span
                    class="validation-errors text-capitalize"
                    v-if="errors[field.name_key]"
                  >
                    {{ errors[field.name_key].replace(/_|\s/g, ' ') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button color-text-invert"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save color-main color-text-invert"
              type="button"
              id="save_address"
              data-toggle="modal"
              :data-target="reOpenAddress"
              v-on:click="checkForm(customer_title)"
            >
              {{ _t('Save Address') }}
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
import { mapState, mapActions, mapGetters } from 'vuex'
// import InformationPopup from '@/components/pos/content/InformationPopup'
import { CoolSelect } from 'vue-cool-select'
import * as CONST from '@/constants'
// import mapLocationSelector from 'vue-google-maps-location-selector'

export default {
  name: 'CreateCustomerAddress',
  props: {},
  components: {
    CoolSelect,
    // mapLocationSelector,
  },
  data() {
    return {
      drop_downs: ['delivery_area_id'],
      selectedDeliveryArea: null,
      errors: {},
      add_delivery_area: '',
      reOpenAddress: '',
      filterBuildingArea: false,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('customer', ['deliveryAreaNames']),
    ...mapState({
      fields: state =>
        state.customer.crm_fields ? state.customer.crm_fields['_ADDRESS'] : [],
      buildingAreas: state => state.customer.buildingAreas,
      crm_fields: state => state.customer.crm_fields,
      mandatory_fields: state => state.customer.mandatory_fields,
      newAddressDetails: state => state.customer.editInformation,
      customer_title: state => state.customer.modalStatus,
      // fetchDeliveryAreas: state => state.customer.fetchDeliveryAreas,
      customerCreateStatus: state => state.customer.responseInformation,
      customerId: state => state.customer.customer._id,
      store: state => state.location.store,
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
    }),
  },
  methods: {
    selectBuilding(selectedArea) {
      this.newAddressDetails.building = selectedArea
      $('#searchDropdown').hide()
    },
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
    /* locationUpdated(latlng) {
      if (this.newAddressDetails.location_coordinates === null) {
        let location_coordinate = {
          ...this.newAddressDetails,
          location_coordinates: { lat: latlng.lat, lng: latlng.lng },
        }
        this.$store.commit('customer/SET_EDIT_DETAILS', location_coordinate)
      } else {
        this.newAddressDetails.location_coordinates.lat = latlng.lat
        this.newAddressDetails.location_coordinates.lng = latlng.lng
      }
      // eslint-disable-next-line no-console
      console.log(this.latitude, this.longitude)
    },*/
    getWithoutSpaceLength(data) {
      if ($.trim(data).length == 0) {
        return false
      }
      return true
    },
    checkForm: function(modalStatus) {
      // eslint-disable-next-line no-debugger
      debugger
      this.errors = {}
      this.errors.count = 0
      this.mandatory_fields.forEach(field => {
        if (field.group === CONST.CUSTOMER_ADDRESS) {
          if (
            !this.newAddressDetails[field.name_key] ||
            !this.getWithoutSpaceLength(this.newAddressDetails[field.name_key])
          ) {
            this.errors[field.name_key] =
              this._t(field.name_key) + ' ' + this._t('is required')
            this.errors.count = 1
          }
        }
      })
      /*if (!this.selectedDeliveryArea) {
        this.errors.delivery_area_id = 'Delivery area required'
        this.errors.count = 1
      }
      if (!this.newAddressDetails.building) {
        this.errors.building = 'Building/Villa required'
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
      if (
        this.newAddressDetails.street &&
        this.newAddressDetails.street.length < 2
      ) {
        this.errors.street = 'Street should be at least 2 characters'
        this.errors.count = 1
      }
      if (
        this.newAddressDetails.building &&
        this.newAddressDetails.building.length > 15
      ) {
        this.errors.building =
          'Building/Villa should be not more than 15 characters'
        this.errors.count = 1
      }*/
      if (this.errors.count === 0) {
        let addAddress = $('#add_address')
        addAddress.modal('toggle')
        // addAddress.click()
        let areaId = ''
        if (this.selectedDeliveryArea) {
          areaId = this.selectedDeliveryArea.split(', ').join('|')
        }
        // this.fetchDeliveryAreas.forEach(element => {
        //   if (this.selectedDeliveryArea === element.delivery_area) {
        //     areaId = element._id
        //   }
        // })
        // eslint-disable-next-line no-console
        /*if (
          this.newAddressDetails.location_coordinates === null ||
          this.newAddressDetails.location_coordinates.lat === 0
        ) {
          // eslint-disable-next-line max-len
          this.newAddressDetails.location_coordinates.lat = this.store.location_coordinates.lat
          // eslint-disable-next-line max-len
          this.newAddressDetails.location_coordinates.lng = this.store.location_coordinates.lng
        }*/
        const formData = {
          ...this.newAddressDetails,
          delivery_area_id: areaId,
          // lat_lng_available: true,
        }
        // eslint-disable-next-line no-console
        console.log(formData, 'ffff')
        if (modalStatus == 'Add') {
          this.createAction({
            data: formData,
            model: 'customer_addresses',
            customer: this.customerId,
          })
          addAddress.modal('toggle')
          $('#add-to-order').modal('toggle')
        }
        if (modalStatus == 'Edit') {
          let actionDetails = {
            id: localStorage.getItem('editItemKey'),
            action: 'edit',
            model: 'customer_addresses',
            data: formData,
          }
          this.updateAction(actionDetails)
          addAddress.modal('toggle')
        }
      }
    },

    ...mapActions('customer', ['createAction', 'updateAction']),
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.getAreaId {
  width: $px889 !important;
}
.validation-errors {
  color: red;
}
textarea#styled {
  width: 293px;
  height: 70px;
  border: 1px solid #e4e7eb;
  padding: 5px;
  border-radius: 2px;
}
#add_address {
  .map-container {
    height: 14.4rem;
    //width: 55.4rem;
    /*left: 13.5rem;
    top: 10px;*/
  }
  #coordinate {
    height: 1.8rem !important;
    width: 2rem !important;
    padding: unset !important;
  }
  .hidden {
    display: none;
  }
  .modal-dialog {
    /*margin: 0;*/

    .modal-content {
      display: grid;
      grid-template-rows: max-content 1fr max-content;

      .modal-header {
        height: 80px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        border: none;
      }
    }

    .modal-content {
      display: grid;
      grid-template-rows: max-content 1fr max-content;

      .modal-header {
        height: 80px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        border: none;
      }

      .modal-body {
        margin: 0;
        /*display: grid;*/
        grid-template-rows: max-content 1fr max-content;
        overflow-y: auto;
        .right-form {
          min-width: 100%;
        }
        .left-form {
          padding: 10px 10px 10px 0;
          min-width: $px448;
          max-width: $px448;
        }
      }
    }

    .modal-footer {
      z-index: 10;
    }
    select,
    input {
      width: 100% !important;
    }
  }
}
@include responsive(mobile) {
  .getAreaId {
    width: auto !important;
  }
  #add_address {
    .modal-dialog {
      margin: 0;
      max-width: 100%;

      .modal-content {
        max-height: 80vh !important;
        overflow: auto;
        .modal-header {
        }
      }

      .modal-content {
        .modal-header {
        }

        .modal-body {
        }

        .modal-footer {
        }
      }
    }
  }
}
</style>
