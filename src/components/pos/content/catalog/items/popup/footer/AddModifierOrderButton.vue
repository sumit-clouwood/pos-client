<template>
  <div class="btn-announce">
    <button
      type="button"
      data-toggle="modal"
      data-target="#select-discount-item"
      data-dismiss="modal"
      class="buttoned colorwhite discountitembutton"
    >
      <img src="img/pos/DiscountIcon.jpg" alt="" />
      <span>{{ _t('Discount Item') }}</span>
    </button>
    <button type="button" class="buttoned colorwhite discountbutton">
      <img src="img/pos/DiscountIcon.jpg" alt="delete" />
      <span>{{ _t('Discount') }}</span>
    </button>
    <button type="button" class="buttoned colorwhite taxbutton">
      <img src="img/pos/delete.jpg" alt="delete" />
      <span>{{ _t('Tax') }}</span>
    </button>
    <button
      type="button"
      class="buttoned colorwhite donebutton"
      data-dismiss="modal"
      @click="addModifierOrder"
    >
      <img src="img/pos/done.png" alt="done" />
      <span>{{ _t('Done') }}</span>
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
