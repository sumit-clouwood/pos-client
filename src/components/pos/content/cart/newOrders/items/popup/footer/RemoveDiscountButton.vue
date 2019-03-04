<template>
  <button
    type="button"
    class="buttoned colorwhite discountbutton undiscount"
    @click="removeItemDiscount()"
  >
    <img src="img/pos/DiscountIcon.jpg" alt="delete" />
    <span>UnDiscount</span>
  </button>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'RemoveDiscountButton',
  methods: {
    ...mapActions('discount', ['removeItemDiscount']),
  },
  props: {},
}
</script>
