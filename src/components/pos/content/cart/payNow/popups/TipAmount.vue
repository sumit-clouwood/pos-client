<template>
  <!-- Tip amount -->
  <div class="modal fade" id="tip-amount" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-body tip-amount">
          <div class="tip-amount-wrap">
            <p>Enter Tip Amount</p>
            <input type="number" name="tip" />
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              <span>âœ•</span> Cancel
            </button>
            <button
              class="btn btn-success btn-large"
              type="button"
              id="add-top"
            >
              <span>+</span>Add
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Tip Amount -->
</template>

<script>
export default {
  name: 'TipAmount',
}
</script>
