<template>
  <button
    type="button"
    class="buttoned colorwhite donebutton"
    data-dismiss="modal"
    @click="item && item.modifiable ? addModifierOrder() : false"
    :class="
      item.modifiable ? 'catalog-with-modifier' : 'catalog-without-modifiers'
    "
  >
    <img src="img/pos/done.png" alt="done" />
    <span>{{ _t('Done') }}</span>
  </button>
</template>
<script>
//this footer ll be called only when we come through order
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ModifyItemModifiersButton',
  props: {},
  methods: {
    ...mapActions('order', ['addModifierOrder']),
  },
  computed: {
    ...mapState({
      item: state => state.order.item,
    }),
  },
}
</script>
