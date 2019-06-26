<template>
    <div class="user">
        <img class="image" src="../../../assets/images/userimg.jpg"/>
        <div class="name">{{userName}}</div>
    </div>
</template>

<script>
    export default {
        name: "user",
        props: ['userSrc', 'userName']
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