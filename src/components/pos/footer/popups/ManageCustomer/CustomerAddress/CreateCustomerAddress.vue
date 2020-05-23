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
          <div class="col-md-12 left-form add-address-form">
            <div class="name-from">
              <label>
                {{ _t('Delivery Area') }}
                <span>*</span>
              </label>
              <cool-select
                class="getAreaId"
                v-model="selectedDeliveryArea"
                :items="deliveryAreas"
              />
              <span class="validation-error" v-if="errors.delivery_area_id">
                {{ errors.delivery_area_id }}
              </span>
            </div>
          </div>
          <div class="col-md-6 left-form add-address-form">
            <div class="alternate-phone-from">
              <label>
                {{ _t('Building/Villa') }}
                <span>*</span>
              </label>
              <input
                type="text"
                name="building"
                v-model="newAddressDetails.building"
              />
              <span class="validation-error" v-if="errors.building">
                {{ errors.building }}
              </span>
            </div>
            <div class="gender">
              <label>
                {{ _t('Street') }}
                <span>*</span>
              </label>
              <input
                type="text"
                name="street"
                v-model="newAddressDetails.street"
              />
              <span class="validation-error" v-if="errors.street">
                {{ errors.street }}
              </span>
            </div>
          </div>
          <div class="col-md-6 right-form add-address-form">
            <div class="landmark">
              <label>
                {{ _t('Flat Number') }}
                <span>*</span>
              </label>
              <input
                type="text"
                name="flat_number"
                v-model="newAddressDetails.flat_number"
              />
              <span class="validation-error" v-if="errors.flat_number">
                {{ errors.flat_number }}
              </span>
            </div>
            <div class="landmark">
              <label>{{ _t('Nearest Landmark') }}</label>
              <input
                type="text"
                name="nearest_landmark"
                v-model="newAddressDetails.nearest_landmark"
              />
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
export default {
  name: 'CreateCustomerAddress',
  props: {},
  components: {
    CoolSelect,
  },
  data() {
    return {
      selectedDeliveryArea: null,
      errors: {},
      add_delivery_area: '',
      reOpenAddress: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState({
      newAddressDetails: state => state.customer.editInformation,
      customer_title: state => state.customer.modalStatus,
      fetchDeliveryAreas: state => state.customer.fetchDeliveryAreas,
      customerCreateStatus: state => state.customer.responseInformation,
      customerId: state => state.customer.customer._id,
      deliveryAreas() {
        if (this.fetchDeliveryAreas) {
          let areas = []
          this.fetchDeliveryAreas.forEach(area => {
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
    checkForm: function(modalStatus) {
      this.errors = {}
      this.errors.count = 0
      if (!this.selectedDeliveryArea) {
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
      }
      if (this.errors.count === 0) {
        let addAddress = $('#add_address')
        addAddress.modal('toggle')
        // addAddress.click()
        let areaId = this.selectedDeliveryArea
        // this.fetchDeliveryAreas.forEach(element => {
        //   if (this.selectedDeliveryArea === element.delivery_area) {
        //     areaId = element._id
        //   }
        // })
        // eslint-disable-next-line no-console
        const formData = {
          ...this.newAddressDetails,
          delivery_area_id: areaId,
          lat_lng_available: false,
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
.getAreaId {
  width: 55.6795rem !important;
}
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
#add_address {
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

        .left-form,
        .right-form {
          padding: 10px;

          .name-from {
            display: grid;
            grid-template-columns: 1fr;

            .validation-error {
              position: static;
            }
          }

          .alternate-phone-from {
            display: grid;
            grid-template-columns: 1fr;

            .validation-error {
              position: static;
            }
          }

          .gender {
            display: grid;
            grid-template-columns: 1fr;

            .validation-error {
              position: static;
            }
          }

          .landmark {
            display: grid;
            grid-template-columns: 1fr;

            .validation-error {
              position: static;
            }
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
