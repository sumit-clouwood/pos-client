<template>
  <!-- order confrmation  -->
  <div class="modal fade" id="order-confirmation" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <SendToDeliveryHeader />
        <SendToDeliveryContent />
        <SendToDeliveryFooter />
      </div>
    </div>
  </div>
  <!-- End Order confirmation  -->
</template>

<script>
import SendToDeliveryHeader from './SendToDelivery/SendToDeliveryHeader';
import SendToDeliveryContent from './SendToDelivery/SendToDeliveryContent';
import SendToDeliveryFooter from './SendToDelivery/SendToDeliveryFooter';
export default {
  name: 'SendToDelivery',
  props: {},
  components: {
    SendToDeliveryHeader,
    SendToDeliveryContent,
    SendToDeliveryFooter
  }
};
</script>
