<template>
  <button
    type="button"
    class="buttoned colorwhite donebutton"
    @click="item && item.modifiable ? addModifierOrder() : updateItemQuantity()"
    :class="
      item.modifiable ? 'catalog-with-modifier' : 'catalog-without-modifiers'
    "
  >
    <img
      src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/done.png"
      alt="done"
    />
    <span>{{ _t('Apply') }}</span>
  </button>
</template>
<script>
//this footer ll be called only when we come through order
/* global hideModal */
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ModifyItemModifiersButton',
  props: {},
  methods: {
    addModifierOrder() {
      this.$store.dispatch('order/addModifierOrder').then(() => {
        hideModal('#POSOrderItemOptions')
      })
    },
    updateItemQuantity() {
      this.$store
        .dispatch(
          'order/updateQuantity',
          this.$store.getters['orderForm/quantity']
        )
        .then(() => {
          hideModal('#POSOrderItemOptions')
        })
    },
  },
  computed: {
    ...mapState({
      item: state => state.order.item,
    }),
    ...mapGetters('location', ['_t']),
  },
}
</script>
