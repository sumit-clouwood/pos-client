<template>
  <!-- pay now screen -->
  <div class="fade" id="pay-now" style="display: none;">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-body pay-now-block">
          <div class="order-payment">
            <div class="order-id">
              <h2>Order Payment</h2>
              <p>Order ID #0213232</p>
            </div>
            <div class="hide-btn">
              <button data-dismiss="modal" id="hide-paynow">
                Hide
                <span
                  ><i class="fa fa-angle-right" aria-hidden="true"></i
                ></span>
              </button>
            </div>
          </div>
          <TotalAmount />
          <div class="payment-method-title">
            <h2>Payment Method</h2>
          </div>

          <PaymentMethods />

          <div class="payemnt-input-block">
            <input type="text" name="payment" value="" id="input" />
            <img src="img/pos/payment-input-icon.png" class="input-image" />
          </div>
          <AmountCalculator />
          <PaymentBreakdown />
          <PayNowFooter />
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End pay now screen  -->
</template>
<script>
import PayNowFooter from './payNow/Footer'
import TotalAmount from './payNow/TotalAmount'
import PaymentMethods from './payNow/PaymentMethods'
import AmountCalculator from './payNow/AmountCalculator'
import PaymentBreakdown from './payNow/PaymentBreakdown'
export default {
  name: 'PayNow',
  components: {
    PaymentMethods,
    TotalAmount,
    PayNowFooter,
    PaymentBreakdown,
    AmountCalculator,
  },
}
</script>
