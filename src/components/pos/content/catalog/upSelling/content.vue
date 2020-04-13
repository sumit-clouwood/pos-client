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

<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';
.modal-content {
  max-height: 75vh !important;
  overflow: scroll;
  .grid_parent_combo {
    @include responsive(mobile) {
      max-height: 19.5rem !important;
      overflow: scroll;
    }
    @media only screen and (max-width: 600px) and (min-width: 320px) {
      .modal-body {
        display: grid;
        grid-template-columns: repeat(2, 2fr);
        grid-column-gap: 0.938rem;
        row-gap: 1rem;
      }
      .food-menu-item-text.color-text {
        font-size: 12px !important;
      }
    }
  }
}
</style>
