<template>
    <div class="LeftNavCategory">
        <ul class="navbar-nav navbar-sidenav" id="exampleAccordion">
            <li class="nav-item logo-wrap" data-toggle="tooltip" data-placement="right" title="" data-original-title="logo">
                <a class="nav-link" href="">
                    <!--<img src="{{url('/images/icon.png')}}">-->
                </a>
            </li>

            <!--<li class="nav-item active-opacity" data-toggle="tooltip" data-placement="right" title=""
                data-original-title="Pizza">
                <a class="nav-link active" href="">
                    &lt;!&ndash;<img src="{{url('/images/pos/pizza.svg')}}">&ndash;&gt;
                    <span class="nav-link-text">Pizza</span>
                </a>
            </li>-->
        </ul>

        <ul class="navbar-nav sidenav-toggler">
            <li class="nav-item arrow-bottom">
                <a class="nav-link" href="#">down-arrow
                    <!--<img class="bt-arrow" src="{{url('/images/pos/down-arrow.png')}}">-->
                    <!--<img class="top-arrow" src="{{url('/images/pos/top-arrow.png')}}">-->
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-center" id="sidenavToggler">profile
                    <!--<img src="{{url('/images/pos/profile-pic.png')}}">-->
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
