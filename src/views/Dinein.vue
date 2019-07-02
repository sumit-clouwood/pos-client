<template>
  <div>
    <div class="contain-body-class">
      <nav
        class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
        id="mainNav"
      >
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <Header />
          <Menu />
        </div>
      </nav>
      <div class="content-wrapper full-dinein" id="dine-in-wrapper">
        <div class="container-fluid row all-tables-dinein" id="all-tables-show">
          <Content />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
// /* global $ */

import Menu from '@/components/dinein/Menu.vue'
import Header from '@/components/dinein/Header.vue'
import Content from '@/components/dinein/Content'
import Footer from '@/components/dinein/Footer'
export default {
  name: 'Dinein',
  computed: {},
  components: {
    Header,
    Menu,
    Content,
    Footer,
  },

  //store private data in component using data
  data: function() {
    return {
      info: null,
      loading: true, //async loading indicator
      errored: false, //either request had error
    }
  },

  //data passed to this component by its parent is contained inside props
  props: {
    msg: String,
  },
  mounted() {
    /*$('body').removeAttr('class')
    $('body').attr('class', 'fixed-nav sticky-footer bg-dark dinein')*/
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/*@import '../assets/sass/dine-in/dineIn.css';*/
</style>
