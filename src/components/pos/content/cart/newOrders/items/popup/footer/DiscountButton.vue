<template>
  <button
    type="button"
    data-toggle="modal"
    data-target="#select-discount-item"
    data-dismiss="modal"
    class="buttoned colorwhite discountitembutton"
  >
    <img src="img/pos/DiscountIcon.jpg" alt="" />
    <span>Discount</span>
  </button>
</template>

<script>
export default {
  name: 'DiscountButton',
  props: {},
}
</script>
