<template>
  <div class="modal-content">
    <Header />
    <Item />
    <Footer />
  </div>
</template>

<script>
import Footer from './footer'
import Header from './header'
import Item from './item'
export default {
  components: {
    Footer,
    Header,
    Item,
  },
}
</script>

<style></style>
