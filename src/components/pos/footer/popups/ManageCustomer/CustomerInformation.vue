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
                  <button id="place-new-order" data-dismiss="modal">
                    Place New Order
                  </button>
                </div>
              </div>
            </div>
            <CustomerInsights />
          </div>
          <h2 class="past-order">Past Orders</h2>
          <CustomerPastOrders />
        </div>
        <div class="modal-footer">
          <!--<div class="pagination-customer-details">
            &lt;!&ndash;<ul class="ullist-pagination">
              <li class="order-pagination active">1</li>
              <li class="order-pagination">2</li>
              <li class="order-pagination">3</li>
              <li class="order-pagination">4</li>
              <li class="next-page" id="next-page">
                <img src="img/pos/next-arrow.png" alt="next-btn" />
              </li>
              <li>Last</li>
            </ul>&ndash;&gt;
          </div>-->
          <div class="pagination-customer-details">
            <paginate
              v-if="paginateDetails.totalPages"
              :page-count="paginateDetails.totalPages"
              :page-range="1"
              :margin-pages="1"
              :clickHandler="setPastOrderPageNumber"
              :prev-text="'Prev'"
              :next-text="'Next'"
              :container-class="''"
              :page-class="'page-item'"
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
              <span>X</span> Dismiss
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
import { mapState, mapActions } from 'vuex'
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
  },
  methods: {
    ...mapActions('customer', ['setPastOrderPageNumber']),
  },
}
</script>
<style scoped lang="scss">
  div#display-order .modal-dialog {
    max-width: 70%;
  }
</style>