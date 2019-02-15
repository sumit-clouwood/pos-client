<template>
    <div class="inventory-location-wrapper pt-5 h-100">
        <div class="mx-auto col-md-3 mt-5">
            <div class="search-location p-4">
                <p class="location-title">Please select a location:</p>
                <form class="form-inline search-inline">
                    <div class="inner-addon left-addon">
                        <img class="search-img" src="img/pos/search-icon.png" alt="search">
                        <input type="text" class="form-control" placeholder="Search location">
                    </div>
                </form>
            </div>
            <ul class="ullist-inventory-location pl-0 pt-2">
                <li class="p-3"><a href="#">ADNOC Al Dar - Sharjah</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Location',
        props: {},
    }
</script>

<style lang="scss" scoped>
    @import '../assets/sass/locations';
</style>