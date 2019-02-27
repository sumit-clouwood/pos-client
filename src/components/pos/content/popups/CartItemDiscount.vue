<template>
  <div
    class="modal fade"
    id="select-discount-item"
    role="dialog"
    style="padding-left: 7px;"
  >
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Discount Item</h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div class="dining-option-block select-discount-option">
            <div class="option-contain">
              <p>25%</p>
              <span class="more">Discount 1</span>
            </div>
            <div class="option-contain active">
              <p>50%</p>
              <span class="more">Discount 2</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large"
              type="button"
              data-dismiss="modal"
              id="discount-save"
            >
              Save
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
  name: 'CartItemDiscount',
  props: {}
};
</script>
