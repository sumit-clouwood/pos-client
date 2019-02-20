<template>
  <!-- Modal -->
  <div
    class="modal fade POSItemOptions"
    id="POSItemOptions"
    tabindex="-1"
    role="dialog"
    aria-labelledby="POSItemOptions"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <ItemModifierHeader />
        <ItemModifierContent />
        <ItemModifierFooter />
      </div>
    </div>
  </div>
  <!-- End Model -->
</template>

<script>
import ItemModifierContent from './ItemModifier/ItemModifierContent'
import ItemModifierHeader from './ItemModifier/ItemModifierHeader'
import ItemModifierFooter from './ItemModifier/ItemModifierFooter'
export default {
  name: 'ItemModifier',
  props: {},
  components: {
    ItemModifierFooter,
    ItemModifierHeader,
    ItemModifierContent,
  },
}
</script>
