<template>
  <div class="btn-announce">
    <button
      type="button"
      class="buttoned colorwhite donebutton"
      @click="addModifierOrder"
    >
      <img src="img/pos/done.png" alt="done" />
      <span>{{ _t('Apply') }}</span>
    </button>
  </div>
</template>
<script>
/* global closeModal */
import { mapGetters } from 'vuex'
export default {
  name: 'AddModifierOrderButton',
  props: {},
  computed: {
    ...mapGetters('location', ['_t']),
  },
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
