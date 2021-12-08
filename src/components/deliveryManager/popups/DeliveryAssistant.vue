<template>
  <div class="modal fade" id="delivery-assistant" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">{{ _t('Delivery Assistant') }}</h4>
        </div>
        <div class="modal-body add-email-wrap">
          <div class="add-note-area">
            <p>
              {{
                _t(
                  'Did you know that Broccoli has a mobile interface for your delivery boys to help them manage deliveries? Simply fire up'
                )
              }}
              <a role="button" class="da-link"
                >http://app.broccoli.com/deliveryassistant</a
              >
              {{
                _t(
                  'on a smart phone and give your delivery boys credentials to log in. They can mark parcels as delivered right at the customers doorstep. This will help you track delivery times and other performance indicators to help you understand the efficiency of your delivery process.'
                )
              }}
            </p>
            <div class="da-image">
              <img src="images/mobile.png" alt="delivery-assistant" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              <span>✕</span> {{ _t('Cancel') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeliveryAssistant',
}
</script>

<style scoped></style>
