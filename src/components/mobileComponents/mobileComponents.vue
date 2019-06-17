<template>
    <div class="mobile-components">
        <profile-sidebar/>
        <mobile-page/>
    </div>
</template>
<script>
    import profileSidebar from './profileSidebar.vue'
    import mobilePage from './mobilePage.vue'

    export default {
        components: {
            profileSidebar,
            mobilePage
        }
    }
</script>
<style lang="scss">
    @import '../../assets/scss/pixels_rem.scss';
    @import '../../assets/scss/variables.scss';
    @import '../../assets/scss/mixins.scss';

    .mobile-components {
        z-index: 50;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: none;
        letter-spacing: 0.5px;
        @include responsive(mobile) {
            display: block;
        }
    }
</style>