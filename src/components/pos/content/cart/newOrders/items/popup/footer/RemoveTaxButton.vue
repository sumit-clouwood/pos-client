<template>
  <button
    type="button"
    class="buttoned colorwhite taxbutton"
    @click="removeTax"
  >
    <img
      src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/delete.jpg"
      alt="delete"
    />
    <span>Tax</span>
  </button>
</template>
<script>
/* global closeModal */
export default {
  name: 'RemoveTaxButton',
  props: {},
  methods: {
    removeTax() {
      this.$store
        .dispatch('order/removeTax')
        .then(() => {
          closeModal('#POSOrderItemOptions')
        })
        .catch()
    },
  },
}
</script>
