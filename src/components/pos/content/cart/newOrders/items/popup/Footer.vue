<template>
  <div class="modal-footer">
    <button
      type="button"
      data-toggle="modal"
      data-target="#select-discount-item"
      data-dismiss="modal"
      class="buttoned colorwhite discountitembutton"
    >
      <img src="img/pos/DiscountIcon.jpg" alt="" />
      <span>Discount</span>
    </button>
    <button type="button" class="buttoned colorwhite discountbutton">
      <img src="img/pos/DiscountIcon.jpg" alt="delete" />
      <span>UnDiscount</span>
    </button>
    <button type="button" class="buttoned colorwhite taxbutton">
      <img src="img/pos/delete.jpg" alt="delete" />
      <span>Tax</span>
    </button>
    <button
      type="button"
      class="buttoned colorwhite donebutton"
      data-dismiss="modal"
      @click="item.modifiable ? addModifierOrder() : false"
      :class="
        item.modifiable ? 'catalog-with-modifier' : 'catalog-without-modifiers'
      "
    >
      <img src="img/pos/done.png" alt="done" />
      <span>Done</span>
    </button>
  </div>
</template>

<script>
//this footer ll be called only when we come through order
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Footer',
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
