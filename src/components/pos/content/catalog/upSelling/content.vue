<template>
  <div class="modal-content">
    <Header />
    <div class="grid_parent_combo">
      <ItemContent />
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from './footer'
import Header from './header'
import ItemContent from './ItemContent'

export default {
  components: {
    Footer,
    Header,
    ItemContent,
  },
}
</script>

<style scoped>
/*.modal-body.color-dashboard-background.grid_left {*/
/*  display: grid;*/
/*  grid-template-columns: 1fr;*/
/*}*/

/*.grid_parent_combo {
  display: grid;
  align-items: self-start;
  grid-template-columns: 1fr;
  padding: 25px 0;
}*/

/*.modal-body.color-dashboard-background.grid_combo_left {*/
/*  grid-template-columns: 1fr;*/
/*  max-height: 350px;*/
/*  overflow: hidden;*/
/*  overflow-y: auto;*/
/*}*/
/*.modal-body.color-dashboard-background.grid_combo_left::-webkit-scrollbar {*/
/*  display: none;*/
/*}*/

.modal-body.color-dashboard-background.grid_combo_item_content .food-menu-item {
  max-height: unset;
}
/*.modal-body.color-dashboard-background.grid_combo_left {*/
/*  padding: 25px 10px !important;*/
/*  padding-top: 0px !important;*/
/*}*/
/*@media only screen and (max-width: 600px) and (min-width: 320px) {
  .grid_parent_combo {
    display: grid;
    grid-template-columns: 1fr;
  }
}*/
</style>
