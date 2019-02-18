<template>
  <div class="modal-footer">
    <button
      type="button"
      data-toggle="modal"
      data-target="#select-discount-item"
      data-dismiss="modal"
      class="buttoned colorwhite discountitembutton"
    >
      <img src="img/pos/DiscountIcon.jpg" alt="" />
      <span>Discount Item</span>
    </button>
    <button type="button" class="buttoned colorwhite discountbutton">
      <img src="img/pos/DiscountIcon.jpg" alt="delete" />
      <span>Discount</span>
    </button>
    <button type="button" class="buttoned colorwhite taxbutton">
      <img src="img/pos/delete.jpg" alt="delete" />
      <span>Tax</span>
    </button>
    <button
      type="button"
      class="buttoned colorwhite donebutton"
      data-dismiss="modal"
    >
      <img src="img/pos/done.png" alt="done" />
      <span>Done</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "ItemModifierFooter",
  props: {}
};
</script>
