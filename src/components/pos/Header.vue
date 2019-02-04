<template>
    <div class="pos-header">
        <TopNavbarLeft></TopNavbarLeft>
        <TopNavbarRight></TopNavbarRight>
    </div>
</template>

<script>
    import TopNavbarLeft from "./Header/TopNavbarLeft"
    import TopNavbarRight from "./Header/TopNavbarRight"

    export default {
        name: 'Header',
        props: {},
        components: {
            TopNavbarLeft,
            TopNavbarRight
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../../assets/sass/variables.scss';
    @import '../../assets/sass/global.scss';
</style>