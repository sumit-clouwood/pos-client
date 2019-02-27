<template>
  <!-- Select Discount  -->
  <div class="modal fade" id="select-discount" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Select Discount</h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div class="dining-option-block select-discount-option">
            <div class="option-contain">
              <p>25%</p>
              <span class="more"
                >Broccoli Staff (on total) Broccoli Staff (on total) Broccoli
                Staff (on total)</span
              >
            </div>
            <div class="option-contain">
              <p>50%</p>
              <span class="more">Broccoli Staff (on total) </span>
            </div>
            <div class="option-contain active">
              <p>50%</p>
              <span class="more">Better homes (on total)</span>
            </div>
            <div class="option-contain">
              <p>50%</p>
              <span class="more"
                >Broccoli Staff (on total) Broccoli Staff (on total) Broccoli
                Staff (on total) Broccoli Staff (on total) Broccoli Staff (on
                total)</span
              >
            </div>
            <div class="option-contain">
              <p>50%</p>
              <span class="more">Fly Dubai (on total)</span>
            </div>
            <div class="option-contain">
              <p>100%</p>
              <span class="more">Discount 1</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large"
              type="button"
              data-dismiss="modal"
              id="discount-save-btn"
            >
              Ok
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Select Discount -->
</template>

<script>
export default {
  name: 'Discount',
  props: {}
};
</script>
