<template>
  <div class="modal-content">
    <Header />
    <div class="grid_parent_combo">
      <Item />
      <ItemContent />
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from './footer'
import Header from './header'
import Item from './item'
import ItemContent from './ItemContent'
export default {
  components: {
    Footer,
    Header,
    Item,
    ItemContent,
  },
}
</script>

<style scoped>
.modal-body.color-dashboard-background.grid_left {
  display: grid;
  grid-template-columns: 1fr;
}

.grid_parent_combo {
  display: grid;
  align-items: self-start;
  grid-template-columns: 1fr 3fr;
}

.modal-body.color-dashboard-background.grid_combo_left {
  grid-template-columns: 1fr;
  max-height: 415px;
  overflow: hidden;
  overflow-y: auto;
}

.modal-body.color-dashboard-background.grid_combo_item_content .food-menu-item {
  max-height: unset;
}
.modal-body.color-dashboard-background.grid_combo_left {
  padding: 25px 10px !important;
}
</style>
