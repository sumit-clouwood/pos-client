<template>
    <div class="title">
        <h1>{{ msg }} </h1>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <Header/>
                <LeftNavCategory/>
            </div>
        </nav>
        <Toolbar msg="Broccoli POS Header Toolbar"/>
        <Content msg="Broccoli POS Content"/>
    </div>

</template>

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
