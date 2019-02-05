<template>
    <div class="row">
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