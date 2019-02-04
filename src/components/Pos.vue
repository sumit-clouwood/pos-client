<template>
    <div class="title">
        <h1>{{ msg }} </h1>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <Header/>
                <LeftNavCategory/>
            </div>
        </nav>
        <h1>{{ $t('title') }} from translation</h1>
        <h1>{{ $t('body') }} from translation</h1>
        <!--<Toolbar msg="Broccoli POS Header Toolbar"/>-->
        <Content msg="Broccoli POS Content"/>
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
    import LeftNavCategory from './pos/LeftNavCategory.vue'
    import Header from './pos/Header.vue'
    import Toolbar from './pos/Toolbar.vue'
    import Content from './pos/Content.vue'

    export default {
        name: 'Pos',
        components: {
            Header,
            LeftNavCategory,
            Toolbar,
            Content
        },
  //store private data in component using data
  data: function () {
    return {
      $someVariable: "someValue"
    }
  },
  //data passed to this component by its parent is contained inside props
        props: {
            msg: String
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
    @import '@/assets/sass/variables.scss';

    .title {
        color: $primary-color;
    }
</style>
