<template>
  <div class="modal-footer">
    <div class="btn-announce">
      <DiscountButton v-if="isPermitted(PERMISSIONS.CAN_GIVE_DISCOUNTS)" />
      <!-- <RemoveDiscountButton /> -->
      <RemoveTaxButton />
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

export default {
  name: 'Footer',
  props: {},
  components: {
    DiscountButton,
    //  RemoveDiscountButton,
    RemoveTaxButton,
    ModifyItemModifiersButton,
  },
}
</script>
