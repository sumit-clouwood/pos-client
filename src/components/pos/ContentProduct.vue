<template>
    <div class="col-md-8 left-container">
        <search/>
        <div class="row">
            <SubMenu/>
            <Products/>
        </div>
    </div>
</template>

<script>
    import Products from './content/Products'
    import Search from './content/Search'
    import SubMenu from './content/SubMenu'

    export default {
        name: 'ContentProduct',
        props: {
            msg: String
        },
        components: {
            Products,
            Search,
            SubMenu,
        }
    }
</script>