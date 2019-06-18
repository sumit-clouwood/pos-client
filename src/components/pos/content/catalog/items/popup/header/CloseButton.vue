<template>
  <button
    type="button"
    class="close"
    data-dismiss="modal"
    aria-label="Close"
    @click="resetForm()"
  >
    <span aria-hidden="true">&times;</span>
  </button>
</template>
<script>
export default {
  name: 'CloseButton',
  computed: {},
  methods: {
    resetForm() {
      this.$store.commit('orderForm/updateQuantity', 1)
    },
  },
}
</script>
