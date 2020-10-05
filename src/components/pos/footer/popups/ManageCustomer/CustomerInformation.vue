<template>
  <!-- CRM details -->
  <div class="modal fade" id="display-order" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <Preloader v-if="customerLoading" />
        <div v-else class="modal-body manage-customer-wrap">
          <div class="crm-details-wrap">
            <div
              id="order-profile"
              class="profile-order order-profile-wrapper "
            >
              <CustomerProfile />
              <CustomerDeliveryAddress />
              <div class="cu-loyality-points">
                <LoyaltyPoint />
                <div class="btn-right-neworder">
                  <button
                    class="color-button color-main color-text-invert place-new-order-wrapper"
                    id="place-new-order"
                    data-dismiss="modal"
                    @click="
                      updateModalSelection(
                        '#order-confirmation',
                        '#display-order'
                      )
                    "
                  >
                    {{ _t('+ Place New Order') }}
                  </button>
                </div>
              </div>
            </div>
            <CustomerInsights :pastOrders="pastOrders" />
          </div>
          <h2 class="past-order color-text-invert">{{ _t('Past Orders') }}</h2>
          <CustomerPastOrders :pastOrders="pastOrders" />
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <div class="pagination-customer-details">
              <paginate
                v-if="paginateDetails.totalPages"
                :page-count="paginateDetails.totalPages"
                :page-range="1"
                :margin-pages="1"
                :clickHandler="setPastOrderPageNumber"
                :prev-text="_t('Prev')"
                :next-text="_t('Next')"
                :container-class="''"
                :page-class="_t('page-item')"
              ></paginate>
              <!--</template>-->
            </div>
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button color-text-invert"
              data-dismiss="modal"
            >
              {{ _t('Dismiss') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End CRM details -->
</template>
<script>
/* global $ */
import { mapState, mapActions, mapGetters } from 'vuex'
import LoyaltyPoint from './CustomerInformation/LoyaltyPoint'
import CustomerProfile from './CustomerInformation/CustomerProfile'
import CustomerInsights from './CustomerInformation/CustomerInsights'
import CustomerPastOrders from './CustomerInformation/CustomerPastOrders'
import CustomerDeliveryAddress from './CustomerInformation/CustomerDeliveryAddress'
import paginate from 'vuejs-paginate'
import Preloader from '@/components/util/Preloader'

export default {
  name: 'CustomerInformation',
  props: {},
  components: {
    LoyaltyPoint,
    CustomerProfile,
    CustomerInsights,
    CustomerPastOrders,
    CustomerDeliveryAddress,
    paginate,
    Preloader,
  },
  computed: {
    ...mapState({
      paginateDetails: state => state.customer.pastOrdersPaginate,
    }),
    ...mapState({
      pastOrders: state => state.customer.pastOrders,
    }),
    ...mapGetters('location', ['_t']),
    ...mapState('checkoutForm', ['msg']),
    ...mapState('customer', ['customerLoading', 'isBrandHasDeliveryOrder']),
  },
  methods: {
    updateModalSelection(modalName, subjectName) {
      if (this.isBrandHasDeliveryOrder) {
        this.updateModalSelectionDelivery(modalName)
        if (this.msg.message.length > 0) {
          $('#payment-msg').modal('show')
        } else {
          $(subjectName).modal('hide')
        }
      }
    },
    ...mapActions('customer', ['setPastOrderPageNumber']),
    ...mapActions('location', ['updateModalSelectionDelivery']),
  },
}
</script>
<style scoped lang="scss">
div#display-order .modal-dialog {
  max-width: 70%;
}
</style>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
@include responsive(mobile) {
  #display-order {
    .modal-dialog {
      margin: 0;
      width: 100vw;
      max-width: none !important;
      transform: none;
      animation: none;
      transition: none;

      .modal-content {
        overflow: auto;

        .modal-body {
          padding: 0 !important;

          .crm-details-wrap {
            display: grid;
            border: none;

            #order-profile {
              width: 100%;

              .ullist-profile {
                grid-template-columns: max-content 1fr;

                li {
                  &:nth-child(3) {
                    grid-column-start: 2;
                    grid-column-end: 3;

                    a {
                      margin-top: 0 !important;
                    }
                  }

                  &:nth-child(4) {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-gap: 10px;
                    grid-template-columns: 1fr;
                    justify-self: start;
                  }

                  a {
                    margin: 0 !important;
                  }

                  .name-confrimation {
                    display: grid;
                  }
                }
              }

              #delivery-area-address {
                .location-delivery-area-address {
                  max-height: none;
                  grid-template-columns: 1fr;
                }
              }

              .cu-loyality-points {
                display: grid;
                grid-template-columns: 1fr !important;
              }
            }

            .customer-insight {
              width: 100% !important;

              .title-cu {
                padding: 10px 0;
              }

              .dob-customer-insight {
                ul {
                  li {
                    margin: 0 !important;
                    text-align: center;
                  }
                }
              }

              .last-order-wrap {
                max-height: none;
                margin-bottom: 20px;
              }

              .title-cu {
                padding-top: 0;
              }

              .customer-insights-notes {
                .table {
                  thead {
                    border: none;

                    tr {
                      th {
                        border: none;
                      }
                    }
                  }

                  tbody {
                    tr {
                      border: none;

                      td {
                        border: none;
                        padding-left: 10px;
                      }
                    }
                  }
                }
              }
            }
          }

          .past-order {
            padding: 0 20px 20px 20px;
          }

          .manage-customer-table {
            padding: 0 20px;

            .table {
              tbody {
                .referal-code-customer {
                  .show-details-his {
                    width: auto;
                    max-width: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .order-profile-wrapper {
    width: 95% !important;
  }
  .place-new-order-wrapper {
    width: 100% !important;
  }
}
@media only screen and (min-width: 599px) {
  #place-new-order {
    font-size: unset !important;
  }
}
</style>
