<template>
  <div
    class="modal fade bd-example-modal-lg"
    tabindex="-1"
    role="dialog"
    aria-labelledby="myLargeModalLabel"
    aria-hidden="true"
    id="orderDetailsPopup"
  >
    <div class="modal-dialog modal-lg">
      <div class="dialog-body modal-content">
        <div class="left-part">
          <LeftPart :orderDetails="selectedOrder" />
        </div>
        <div class="right-part">
          <div class="tab-content" id="nav-tabContent">
            <RightPartHeader />

            <!--content-->
            <Receipt :orderDetails="selectedOrder.item" />
            <History :orderDetails="selectedOrder.item" />
            <Modification />
            <Payment :orderDetails="selectedOrder.item" />
          </div>
        </div>
        <div class="buttons">
          <div class="v-menu v-menu--inline">
            <div class="v-menu__activator">
              <div class="dropdown">
                <button
                  class="button btn btn-success dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Reprint
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#">Action</a>
                  <a class="dropdown-item" href="#">Another action</a>
                  <a class="dropdown-item" href="#">Something else here</a>
                </div>
              </div>
            </div>
          </div>
          <button type="button" class="button text-button btn btn-success">
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div class="button-caption">
                Cancel Order
              </div>
            </div>
          </button>
          <button type="button" class="button text-button btn btn-success">
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div class="button-caption">
                Modify Order
              </div>
            </div>
          </button>
          <button
            type="button"
            class="button past-order-buttons btn btn-success"
          >
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div class="button-caption">
                Open Past Orders
              </div>
            </div>
          </button>
          <button type="button" class="button close-button btn btn-success">
            <div class="button-content-container">
              <div class="button-icon-container"></div>
              <div class="button-caption">
                Close
              </div>
            </div>
          </button>
          <iframe frameborder="0" srcdoc="" width="0px" height="0px"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Receipt from '@/components/pos/content/orderDetails/rightContent/Receipt'
import History from '@/components/pos/content/orderDetails/rightContent/History'
import Modification from '@/components/pos/content/orderDetails/rightContent/Modification'
import Payment from '@/components/pos/content/orderDetails/rightContent/Payment'
import RightPartHeader from '@/components/pos/content/orderDetails/RightPartHeader'
import LeftPart from '@/components/pos/content/orderDetails/LeftPart'
import { mapState } from 'vuex'

export default {
  name: 'OrderDetailPopup',
  props: {},
  components: {
    RightPartHeader,
    Receipt,
    History,
    Modification,
    Payment,
    LeftPart,
  },
  computed: {
    ...mapState('order', ['selectedOrder']),
  },
}
</script>
<style scoped lang="scss">
#orderDetailsPopup .modal-dialog {
  max-width: 70%;
}
</style>
