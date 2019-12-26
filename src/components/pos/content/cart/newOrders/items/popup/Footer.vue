<template>
  <div class="modal-footer">
    <div class="btn-announce">
      <DiscountButton v-if="!waiter && !carhop" />
      <!-- <RemoveDiscountButton /> -->
      <RemoveTaxButton v-if="!carhop" />
      <ModifyItemModifiersButton />
    </div>
  </div>
</template>

<script>
//this footer ll be called only when we come through order
import DiscountButton from './footer/DiscountButton'
//import RemoveDiscountButton from './footer/RemoveDiscountButton'
import RemoveTaxButton from './footer/RemoveTaxButton'
import ModifyItemModifiersButton from './footer/ModifyItemModifiersButton'
import { mapGetters } from 'vuex'

export default {
  name: 'Footer',
  props: {},
  components: {
    DiscountButton,
    //  RemoveDiscountButton,
    RemoveTaxButton,
    ModifyItemModifiersButton,
  },
  computed: {
    ...mapGetters('auth', ['waiter', 'carhop']),
  },
}
</script>
