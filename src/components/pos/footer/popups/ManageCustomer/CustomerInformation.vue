<template>
  <!-- CRM details -->
  <div class="modal fade" id="display-order" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-body manage-customer-wrap">
          <div class="crm-details-wrap">
            <div id="order-profile" class="profile-order">
              <CustomerProfile />
              <CustomerDeliveryAddress />
              <div class="cu-loyality-points">
                <LoyaltyPoint />
                <div class="btn-right-neworder">
                  <button
                    id="place-new-order"
                    data-dismiss="modal"
                    @click="updateModalSelection('#order-confirmation')"
                  >
                    {{ _t('+ Place New Order') }}
                  </button>
                </div>
              </div>
            </div>
            <CustomerInsights :pastOrders="pastOrders" />
          </div>
          <h2 class="past-order">{{ _t('Past Orders') }}</h2>
          <CustomerPastOrders :pastOrders="pastOrders" />
        </div>
        <div class="modal-footer">
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
            >
            </paginate>
            <!--</template>-->
          </div>
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
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
  },
  methods: {
    updateModalSelection(modalName) {
      this.updateModalSelectionDelivery(modalName)
      if (this.msg) {
        $('#payment-msg').modal('show')
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
