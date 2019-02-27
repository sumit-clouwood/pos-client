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
      <div class="content-wrapper">
        <div class="container-fluid row">
          <Announcement />
          <Content />
          <!--<h1>{{ $t('title') }} from translation</h1>-->
          <!--<h1>{{ $t('body') }} from translation</h1>-->
          <!--<Content msg="Broccoli POS Content"/>-->
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<i18n>
    {
    "en": {
    "title": "Broccoli POS (En)",
    "body": "Broccoli POS Body (En)"
    },
    "ar": {
    "title": "Broccoli POS (Ar)",
    "body": "Broccoli POS Body (Ar)"
    }
    }
</i18n>

<script>
import Menu from './pos/Menu.vue';
import Header from './pos/Header.vue';
import Content from './pos/Content';
import Announcement from './pos/header/Announcement';
import Footer from './pos/Footer';

export default {
  name: 'Pos',

  components: {
    Header,
    Menu,
    Content,
    Announcement,
    Footer
  },

  //store private data in component using data
  data: function() {
    return {
      info: null,
      loading: true, //async loading indicator
      errored: false //either request had error
    };
  },

  //data passed to this component by its parent is contained inside props
  props: {
    msg: String
  }

  /*//life cycle hooks
    beforeCreate () {
      this.$store.dispatch('auth/auth')
        .then((response) => {
            this.$store.dispatch('category/fetchAll', response);
            this.$store.dispatch('modifier/fetchAll', response);
        })
        .catch(error => this.errored = error)
    },

    mounted () {
      
    }*/
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
@import "../assets/sass/variables";
@import "../assets/sass/global";
@import "../assets/sass/footer";
@import "../assets/sass/mixins.scss";
@import "../assets/sass/navbar.scss";
.title {
  color: $primary-color;
}
</style>
