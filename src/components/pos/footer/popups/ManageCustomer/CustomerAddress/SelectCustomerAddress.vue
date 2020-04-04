<template>
  <!-- Add to order popup -->
  <div class="modal fade" id="add-to-order" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Add to Order') }}
          </h4>
        </div>
        <Preloader v-if="customerLoading" />
        <div v-else class="modal-body add-to-order">
          <CustomerDeliveryArea :buttons="false" classAccess="addOrders" />
          <!--<div class="error" v-else-if="error">No address found.</div>
                    <div class="loading" v-else><Preloader /></div>-->
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              id="cu-add-address"
              data-toggle="modal"
              data-target="#add_address"
              class="btn btn-success btn-large color-text-invert color-secondary"
              data-dismiss="modal"
              @click="
                setDefaultSettingsGlobalAddUpdate({ nearest_landmark: '' })
              "
            >
              {{ _t('+ Add Address') }}
            </button>
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button color-text-invert"
              data-dismiss="modal"
              id="cancel-annc"
            >
              {{ _t('Close') }}
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save color-main color-text-invert"
              type="button"
              id="add-customer-btn"
              @click="
                updateModalSelection('#order-confirmation', '#add-to-order')
              "
            >
              {{ _t('+ Add') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Add to order popup -->
</template>

<script>
/* global $ */
import { mapActions, mapGetters, mapState } from 'vuex'
import Preloader from '@/components/util/Preloader'
import CustomerDeliveryArea from '../CustomerAddress/CustomerDeliveryArea'

export default {
  name: 'SelectCustomerAddress',
  components: {
    CustomerDeliveryArea,
    Preloader,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('checkoutForm', ['msg']),
    ...mapState('customer', ['customerLoading']),
  },
  methods: {
    updateModalSelection(modalName, subjectName) {
      this.updateModalSelectionDelivery(modalName)
      // eslint-disable-next-line no-console
      if (this.msg != null && this.msg.message.length > 0) {
        $('#payment-msg').modal('show')
      } else {
        $(subjectName).modal('hide')
      }
    },
    ...mapActions('location', ['updateModalSelectionDelivery']),
    ...mapActions('customer', ['setDefaultSettingsGlobalAddUpdate']),
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #add-to-order {
    .modal-dialog {
      margin: 0;
      max-width: 100%;
      .modal-content {
        .modal-header {
          height: 80px;
          min-height: 80px;
          background-color: #fff;
          border: none;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .modal-body {
          overflow: auto;
          // height: calc(100vh - 200px);
          min-height: 0 !important;

          .location-delivery-area-address {
            .order-location {
              &.active {
                border: 2px solid $green-middle;
                &:after {
                  border: 2px solid $green-middle !important;
                }
              }

              &:after {
                background-color: $green-middle;
                border: 2px solid $green-middle;
                top: -2px;
                right: -2px;
              }
            }
          }

          .addOrders {
            max-height: none;
          }
        }

        .modal-footer {
          .btn-announce {
            display: grid;
            grid-template-columns: max-content max-content max-content;
            grid-gap: 10px;

            button {
              width: 100% !important;
              margin: 0;
              padding: 0 20px;
            }
          }
        }
      }
    }
  }
}
</style>
