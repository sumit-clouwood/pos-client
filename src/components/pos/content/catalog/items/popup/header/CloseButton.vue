<template>
  <button
    type="button"
    class="close color-text"
    data-dismiss="modal"
    aria-label="Close"
    @click="resetForm()"
  >
    <span aria-hidden="true" class="color-text-invert">&times;</span>
  </button>
</template>
<script>
export default {
  name: "CloseButton",
  computed: {},
  methods: {
    resetForm() {
      this.$store.commit("orderForm/updateQuantity", 1);
    }
  }
};
</script>
