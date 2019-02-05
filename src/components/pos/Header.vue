<template>
    <div class="pos-header">
        <TopNavbarLeft></TopNavbarLeft>
        <TopNavbarRight></TopNavbarRight>
    </div>
</template>

<script>
    import TopNavbarLeft from "./header/TopNavbarLeft"
    import TopNavbarRight from "./header/TopNavbarRight"

    export default {
        name: 'Header',
        props: {},
        components: {
            TopNavbarLeft,
            TopNavbarRight
        }
    };
</script>