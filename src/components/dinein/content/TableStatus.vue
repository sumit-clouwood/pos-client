<template>
    <div class="dinein-table-control">
        <div class="dinein-seat-available">
            <ul class="ullist-dinein-table">
                <li id="unavailable-seat"><span>{{ tableStatus.unavailable }}</span>Unavailable</li>
                <li id="available-seat"><span>{{ tableStatus.available }}</span>Available</li>
                <li id="available-soon-seat"><span>{{ tableStatus.available_soon }}</span>Available Soon</li>
            </ul>
        </div>
        <div class="zoom-wrap-dinein">
            <div class="POSItemOptions_quantity_inputs">
                <button class="qtyminus value-qty">-</button>
                <input class="qty" min="1" name="quantity" type="text" value="100" />
                <button class="qtyplus value-qty">+</button>
            </div>
            <div class="round-dinein-circle">
            <span id="dine-top">
              <img src="img/dinein/chairs/dine-top.svg">
            </span>
                <span id="dine-left">
            <img src="img/dinein/chairs/dine-left.svg">
            </span>
                <span id="dine-right">
                 <img src="img/dinein/chairs/dine-right.svg">
            </span>
                <span id="dine-bottom">
              <img src="img/dinein/chairs/dine-bottom.svg">
            </span>
                <div class="inner-round">
                    <div class="sub-inner-round"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'TableStatus',
    computed: {
      ...mapState('dinein', ['tableStatus'])
    }
  }
</script>