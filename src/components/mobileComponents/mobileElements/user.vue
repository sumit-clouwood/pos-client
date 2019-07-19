<template>
    <div class="user">
        <img class="image" :src="'img/pos/' + param.img"/>
        <div class="name">{{param.name}}</div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "user",
        props: ['param'],
        computed: {
            ...mapGetters(['testUsers'])
        }
    }
</script>

<style lang="scss">
    .user {
        display: grid;
        grid-template-columns: max-content 1fr;
        align-items: center;
        grid-gap: 20px;

        .image {
            width: 80px;
            height: 80px;
            border: 2px solid #fff;
            border-radius: 50%;
        }

        .name {

        }
    }
</style>