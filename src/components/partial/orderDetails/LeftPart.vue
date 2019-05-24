<template>
  <div class="details row">
    <div class="col-md-6">
      <div class="details-item">
        <span class="details-item-name">Order No:</span>
        <p>44</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Order Status:</span>
        <p>On Hold</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Order Type:</span>
        <p>Call Center</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Location/Branch:</span>
        <p>Store Store Name 666</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Order Date/Time:</span>
        <p>19th Jun 2019, 08:52:03 PM</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Order Duration:</span>
        <p>
          3 weeks, 6 days, 3 hours, 2 minutes, 3 seconds
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Placed By:</span>
        <p>Seeding</p>
      </div>
    </div>
    <div class="col-md-6">
      <div class="details-item">
        <span class="details-item-name">Customer Name:</span>
        <p>Customer Name 3805</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Customer Phone Number:</span>
        <p>71234567890</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Customer Email:</span>
        <p>Custom3806@test.com</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Loyalty Points Earned:</span>
        <p>N/A</p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Delivery Area:</span>
        <p>
          Delivery Area Name 834
        </p>
      </div>
      <div class="details-item">
        <span class="details-item-name">Driver:</span>
        <p>
          Super Admin
        </p>
      </div>
      <div class="details-item details-item-double-span">
        <span class="details-item-name">Order Delivery Address:</span>
        <p>
          Order Flat Number 6962, Order Building/Villa 6960, Order Street 6961,
          Order City 6964
        </p>
      </div>
    </div>

    <!----><!---->
    <!--    <div class="divider"></div>-->
  </div>
</template>

<script>
export default {
  name: 'LeftPart',
}
</script>

<style scoped lang="scss">
.details.row {
  margin: 25px;
}

span.details-item-name {
  font-weight: bold;
}
</style>
