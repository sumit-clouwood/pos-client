<template>
    <div class="row inner-container">
        <ContentItems />
        <ContentCart/>
    </div>
</template>

<script>
    import ContentCart from './content/Cart'
    import ContentItems from './content/Item'
    export default {
        name:'Content',
        props: {},
        components: {
            ContentCart,
            ContentItems
        }
    }
</script>
<style scoped>
.inner-container {
    width: 100%
}
</style>
