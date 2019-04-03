<template>
  <button
    type="button"
    class="buttoned colorwhite donebutton"
    @click="addModifierOrder"
  >
    <img src="img/pos/done.png" alt="done" />
    <span>Done</span>
  </button>
</template>
<script>
/* global closeModal */

export default {
  name: 'AddModifierOrderButton',
  props: {},
  methods: {
    addModifierOrder() {
      this.$store
        .dispatch('order/addModifierOrder')
        .then(() => {
          closeModal('#POSItemOptions')
        })
        .catch()
    },
  },
}
</script>
