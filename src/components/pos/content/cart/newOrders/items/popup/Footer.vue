<template>
  <div class="modal-footer">
    <div class="btn-announce">
      <DiscountButton v-if="!carhop && !waiter" />
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
  computed: {
    role() {
      const roleId = this.$store.state.auth.userDetails.item.brand_role
      if (roleId && this.$store.state.auth.rolePermissions) {
        const role = this.$store.state.auth.rolePermissions.find(
          role => role._id === roleId
        )
        return role ? role.name : ''
      }
      return ''
    },
    waiter() {
      return this.role === 'Waiter'
    },
    carhop() {
      return this.role === 'Carhop User'
    },
  },
}
</script>
