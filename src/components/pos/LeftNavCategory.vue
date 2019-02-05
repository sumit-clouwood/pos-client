<template>
    <div>
        <ul class="navbar-nav navbar-sidenav" id="exampleAccordion">
            <li class="nav-item logo-wrap" data-toggle="tooltip" data-placement="right" title="" data-original-title="logo">
                <a class="nav-link" href="">
                    <img src="img/icons/icon.png">
                </a>
            </li>

            <li class="nav-item active-opacity" data-toggle="tooltip" data-placement="right" title=""
                data-original-title="Pizza">
                <a class="nav-link active" href="">
                    <img src="img/pos/pizza.svg">
                    <span class="nav-link-text">Pizza</span>
                </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="" data-original-title="Pasta">
                <a class="nav-link" href="">
                    <img src="img/pos/pasta.svg">
                    <span class="nav-link-text">Pasta</span>
                </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="" data-original-title="Lasagna">
                <a class="nav-link" href="">
                    <img src="img/pos/lasagna.svg">
                    <span class="nav-link-text">Lasagna</span>
                </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="" data-original-title="Breakfast">
                <a class="nav-link">
                    <img src="img/pos/breakfast.svg">
                    <span class="nav-link-text">Breakfast</span>
                </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="" data-original-title="Salad">
                <a class="nav-link">
                    <img src="img/pos/salad.svg">
                    <span class="nav-link-text">Salad</span>
                </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="" data-original-title="Soup">
                <a class="nav-link">
                    <img src="img/pos/soup.svg">
                    <span class="nav-link-text">Soup</span>
                </a>

            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="" data-original-title="Beverages">
                <a class="nav-link" href="#">
                    <img src="img/pos/beverage.svg">
                    <span class="nav-link-text">Beverages</span>
                </a>
            </li>

            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="" data-original-title="Misc.">
                <a class="nav-link" href="#">
                    <img src="img/pos/misc.svg">
                    <span class="nav-link-text">Misc.</span>
                </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="" data-original-title="Offers">
                <a class="nav-link" href="#">
                    <img src="img/pos/offers.svg">
                    <span class="nav-link-text">Offers</span>
                </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="" data-original-title="Lasagana">
                <a class="nav-link" href="#">
                    <img src="img/pos/pizza.svg">
                    <span class="nav-link-text">Lasagana</span>
                </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="" data-original-title="Talabat">
                <a class="nav-link" href="#">
                    <img src="img/pos/pizza.svg">
                    <span class="nav-link-text">Talabat</span>
                </a>
            </li>
        </ul>

        <ul class="navbar-nav sidenav-toggler">
            <li class="nav-item arrow-bottom">
                <a class="nav-link" href="#">
                    <img class="bt-arrow" src="img/pos/down-arrow.png">
                    <img class="top-arrow" src="img/pos/top-arrow.png">
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-center" id="sidenavToggler">
                    <img src="img/pos/profile-pic.png">
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'LeftNavCategory',
        props: {
        },
    };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--<style lang="scss" scoped>
    @import '../../assets/sass/variables.scss';
    @import '../../assets/sass/mixins.scss';
    @import '../../assets/sass/navbar.scss';
</style>-->
