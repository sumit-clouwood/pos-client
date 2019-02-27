<template>
  <div class="modal-body order-confirmation-wrap">
    <SendToDeliveryContentItem />
    <SendToDeliveryContentPaymentDetails />
    <!--<div class="cash-referal">
        <label class="container-checkbox">Cash On Delivery
        <input type="checkbox" checked>
        <span class="checkmark"></span>
        </label>
        </div>-->
  </div>
</template>

<script>
import SendToDeliveryContentItem from './SendToDeliveryContent/SendToDeliveryContentItem';
import SendToDeliveryContentPaymentDetails from './SendToDeliveryContent/SendToDeliveryContentPaymentDetails';
export default {
  name: 'SendToDeliveryContent',
  props: {},
  components: {
    SendToDeliveryContentItem,
    SendToDeliveryContentPaymentDetails
  }
};
</script>
