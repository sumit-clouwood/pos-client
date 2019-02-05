<template>
    <div class="col-md-8 left-container">
        <search/>
        <div class="row">
            <SubMenu/>
            <Items/>
        </div>
    </div>
</template>

<script>
    import Items from './item/Items'
    import Search from './Search'
    import SubMenu from './SubMenu'

    export default {
        name: 'ContentProduct',
        props: {
            msg: String
        },
        components: {
            Items,
            Search,
            SubMenu,
        }
    }
</script>