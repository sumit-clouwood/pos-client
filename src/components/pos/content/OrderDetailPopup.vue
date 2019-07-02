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
      <div class="modal-content">
        <div class="col-md-5">
          <div data-v-f6351270="" class="left-part">
            <LeftPart :orderDetails="selectedOrder" />
          </div>
        </div>
        <div class="col-md-7 right-part">
          <div class="tab-content" id="nav-tabContent">
            <RightPartHeader />

            <!--content-->
            <Receipt :orderDetails="selectedOrder.item" />
            <History :orderDetails="selectedOrder.item" />
            <Modification />
            <Payment :orderDetails="selectedOrder.item" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Receipt from "@/components/pos/content/orderDetails/rightContent/Receipt";
import History from "@/components/pos/content/orderDetails/rightContent/History";
import Modification from "@/components/pos/content/orderDetails/rightContent/Modification";
import Payment from "@/components/pos/content/orderDetails/rightContent/Payment";
import RightPartHeader from "@/components/pos/content/orderDetails/RightPartHeader";
import LeftPart from "@/components/pos/content/orderDetails/LeftPart";
import { mapState } from "vuex";

export default {
  name: "OrderDetailPopup",
  props: {},
  components: {
    RightPartHeader,
    Receipt,
    History,
    Modification,
    Payment,
    LeftPart
  },
  computed: {
    ...mapState("order", ["selectedOrder"])
  }
};
</script>
<style scoped lang="scss">
#orderDetailsPopup .modal-dialog {
  max-width: 70%;
}
#orderDetailsPopup .modal-content {
  flex-direction: row;
}
div#nav-tabContent {
  margin: 25px;
}
</style>
