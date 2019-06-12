<template>
  <button
    type="button"
    class="buttoned colorwhite taxbutton"
    @click="removeItemTax"
  >
    <img src="/pos/img/pos/delete.jpg" alt="delete" />
    <span>Tax</span>
  </button>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'RemoveTaxButton',
  props: {},
  methods: {
    ...mapActions('order', ['removeItemTax']),
  },
}
</script>
