<template>
  <!-- Amount change -->
  <div class="modal fade" id="change-amount" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Amount Change</h4>
        </div>
        <div class="modal-body change-amount-option">
          <div class="amount-change-wrap">
            <p>Change <span>(INR)</span></p>
            <h1>4.25</h1>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large"
              type="button"
              data-dismiss="modal"
              id="dining-opt"
            >
              Ok
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>

  <!-- End Amount change  -->
</template>

<script>
export default {
  name: 'AmountChange',
}
</script>
