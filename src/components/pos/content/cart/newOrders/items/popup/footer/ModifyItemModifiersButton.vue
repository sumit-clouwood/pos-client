<template>
  <button
    type="button"
    class="buttoned colorwhite donebutton"
    data-dismiss="modal"
    @click="item && item.modifiable ? addModifierOrder() : updateItemQuantity()"
    :class="
      item.modifiable ? 'catalog-with-modifier' : 'catalog-without-modifiers'
    "
  >
    <img src="img/pos/done.png" alt="done" />
    <span>{{ _t('Apply') }}</span>
  </button>
</template>
<script>
//this footer ll be called only when we come through order
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'ModifyItemModifiersButton',
  props: {},
  methods: {
    ...mapActions('order', ['addModifierOrder']),
    updateItemQuantity() {
      this.$store.dispatch(
        'order/updateQuantity',
        this.$store.getters['orderForm/quantity']
      )
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
