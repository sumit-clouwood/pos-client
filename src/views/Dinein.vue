<template>
  <div class="new-pos">

    <div class="dm-screen-wrap toggle-nav-content">
      <Header />
    </div>
    <SystemNavigation />
    <!-- Breadcrumbs-->
    <div class="content-wrapper toggle-nav-content" id="dm-content-wrapper">
      <div class="inner-content-dm">
        <Content />
        <Footer />
      </div>
    </div>
    <div class="modal-backdrop fade show" id="transparent-screen"></div>
    <!--<div>
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
    </div>-->
  </div>
</template>

<script>
// /* global $ */
import SystemNavigation from '@/components/SystemNavigation'
import Header from '@/components/dinein/Header.vue'
import Content from '@/components/dinein/Content'
import Footer from '@/components/dinein/Footer'
export default {
  name: 'Dinein',
  computed: {},
  components: {
    Header,
    SystemNavigation,
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
    let getBody = $('body')
    getBody.removeAttr('class')
    getBody.attr('class', 'fixed-nav sticky-footer dm-manager')
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
/*@import '../assets/scss/dine-in/dineIn.css';*/
</style>
