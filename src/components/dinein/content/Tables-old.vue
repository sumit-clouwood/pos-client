<template>
  <div class="dine-in-tabel-wrapper">
    <div class="inner-dinein-table">
      <div class="dinein-table-control">
        <div class="dinein-seat-available">
          <ul class="ullist-dinein-table">
            <li id="unavailable-seat"><span>3</span>Unavailable</li>
            <li id="available-seat"><span>4</span>Available</li>
            <li id="available-soon-seat"><span>3</span>Available Soon</li>
          </ul>
        </div>
        <div class="zoom-wrap-dinein">
          <div class="POSItemOptions_quantity_inputs">
            <button class="qtyminus value-qty">-</button>
            <input
              class="qty"
              min="1"
              name="quantity"
              type="text"
              value="100"
            />
            <button class="qtyplus value-qty">+</button>
          </div>
          <div class="round-dinein-circle">
            <span id="dine-top">
              <img src="img/dinein/chairs/dine-top.svg" />
            </span>
            <span id="dine-left">
              <img src="img/dinein/chairs/dine-left.svg" />
            </span>
            <span id="dine-right">
              <img src="img/dinein/chairs/dine-bottom.svg" />
            </span>
            <span id="dine-bottom">
              <img src="img/dinein/chairs/dine-bottom.svg" />
            </span>
            <div class="inner-round">
              <div class="sub-inner-round"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="sitting-dinein-table ui-droppable" id="sitting-dinein-table">
        <div class="sitting-dine-wrap disable-sorting">
          <div class="sitting-image" data-target="/pos-walkin-cashier/pos.html">
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-left-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-right-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl" id="table-1">
              <span class="unavailble-seat"></span
              ><span class="tbl-number">1</span>
              <div class="unavailable-tbl-dropdown">
                <button
                  aria-expanded="false"
                  aria-haspopup="true"
                  class="btn dropdown-toggle"
                  data-toggle="dropdown"
                  data-value=""
                  id="unavailable-tbl-dropdown"
                  type="button"
                >
                  <span>&gt;</span>
                </button>
                <!--<span>
                <img src="images/referal-down.png"></span>-->
                <div class="dropdown-menu">
                  <a
                    class="dropdown-item cursor-pointer"
                    data-value="Table 3"
                    role="button"
                    >Table 3</a
                  >
                  <a
                    class="dropdown-item cursor-pointer"
                    data-value="Table 3 A"
                    role="button"
                    >Table 3 A</a
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="sitting-image" data-target="/pos-walkin-cashier/pos.html">
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-left-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-right-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl" id="table-2">
              <span class="availble_soon-seat"></span
              ><span class="tbl-number">2</span>
            </div>
          </div>
          <div class="sitting-image" data-target="/pos-walkin-cashier/pos.html">
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-left-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-right-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl" id="table-3">
              <span class="availble-seat"></span
              ><span class="tbl-number">3</span
              ><span class="booked-time">Booked in 2h</span>
            </div>
          </div>
          <div class="sitting-image" data-target="/pos-walkin-cashier/pos.html">
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-left-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-right-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl" id="table-4">
              <span class="availble-seat"></span
              ><span class="tbl-number">4</span
              ><span class="booked-time">Booked in 2h</span>
            </div>
          </div>
          <div class="sitting-image" data-target="/pos-walkin-cashier/pos.html">
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-left-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-right-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl" id="table-5">
              <span class="availble-seat"></span
              ><span class="tbl-number">5</span>
            </div>
          </div>
          <div
            class="sitting-image round-sitting-image round-two-chairs"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl round-sitting-tbl" id="table-7">
              <span class="availble-seat"></span
              ><span class="tbl-number">7</span>
            </div>
          </div>
          <div
            class="sitting-image round-sitting-image round-four-chairs"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-left-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-right-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl round-sitting-tbl" id="table-6">
              <span class="availble-seat"></span
              ><span class="tbl-number">6</span>
            </div>
          </div>
        </div>

        <div class="sitting-dine-wrap disable-sorting">
          <div
            class="sitting-image dine-large"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-top-left-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-bottom-right-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl-large" id="table-8">
              <span class="unavailble-seat"></span
              ><span class="tbl-number">8</span>
            </div>
          </div>
          <div
            class="sitting-image dine-large"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-top-left-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-bottom-right-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl-large" id="table-9">
              <span class="availble_soon-seat"></span
              ><span class="tbl-number">9</span>
            </div>
          </div>
          <div
            class="sitting-image dine-large"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-top-left-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-bottom-right-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl-large" id="table-10">
              <span class="availble-seat"></span
              ><span class="tbl-number">10</span>
            </div>
          </div>
          <div
            class="sitting-image dine-large dine-large-six-chairs"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-top-left-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-left-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-right-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <span class="dine-bottom-right-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl-large" id="table-11">
              <span class="availble-seat"></span
              ><span class="tbl-number">11</span>
            </div>
          </div>
          <div
            class="sitting-image round-sitting-image round-six-chairs"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-left-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-left-top-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-right-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <span class="dine-right-top-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <div class="sitting-tbl round-sitting-tbl" id="table-18">
              <span class="availble-seat"></span
              ><span class="tbl-number">6</span>
            </div>
          </div>
        </div>

        <div class="sitting-dine-wrap disable-sorting">
          <div
            class="sitting-image dine-long"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-left_side-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-left-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-right-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <span class="dine-right_side-img">
              <img src="img/dinein/chairs/dine-right_side-img.svg" />
            </span>
            <div class="sitting-tbl-long" id="table-12">
              <span class="unavailble-seat"></span
              ><span class="tbl-number">12</span>
            </div>
          </div>
          <div
            class="sitting-image dine-long"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-left_side-img">
              <img src="img/dinein/chairs/dine-left_side-img.svg" />
            </span>
            <span class="dine-left-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-right-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <span class="dine-right_side-img">
              <img src="img/dinein/chairs/dine-right_side-img.svg" />
            </span>
            <div class="sitting-tbl-long" id="table-13">
              <span class="availble_soon-seat"></span
              ><span class="tbl-number">13</span>
            </div>
          </div>
          <div
            class="sitting-image dine-long"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-left_side-img">
              <img src="img/dinein/chairs/dine-left_side-img.svg"
            /></span>

            <span class="dine-left-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-right-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <span class="dine-right_side-img">
              <img src="img/dinein/chairs/dine-right_side-img.svg"
            /></span>

            <div class="sitting-tbl-long" id="table-14">
              <span class="availble-seat"></span
              ><span class="tbl-number">14</span>
            </div>
          </div>
          <div
            class="sitting-image dine-large ten-chairs sevn"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-top-full-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-top-left-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-bottom-full-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <span class="dine-bottom-right-full-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <span class="dine-bottom-right-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl-large medium" id="table-15">
              <span class="availble-seat"></span
              ><span class="tbl-number">15</span>
            </div>
          </div>
          <div
            class="sitting-image dine-large ten-chairs"
            data-target="/pos-walkin-cashier/pos.html"
          >
            <span class="dine-top-img">
              <img src="img/dinein/chairs/dine-top-img.svg" />
            </span>
            <span class="dine-top-full-img">
              <img src="img/dinein/chairs/dine-top-full-img.svg" />
            </span>
            <span class="dine-top-left-full-img">
              <img src="img/dinein/chairs/dine-top-left-full-img.svg" />
            </span>

            <span class="dine-top-left-img">
              <img src="img/dinein/chairs/dine-top-left-img.svg" />
            </span>
            <span class="dine-left-img">
              <img src="img/dinein/chairs/dine-left-img.svg" />
            </span>
            <span class="dine-right-img">
              <img src="img/dinein/chairs/dine-right-img.svg" />
            </span>
            <span class="dine-bottom-right-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <span class="dine-bottom-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <span class="dine-bottom-right-full-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <span class="dine-bottom-full-img">
              <img src="img/dinein/chairs/dine-bottom-img.svg" />
            </span>
            <div class="sitting-tbl-large full" id="table-16">
              <span class="availble-seat"></span
              ><span class="tbl-number">16</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Tables',
  props: {},
  components: {},
  computed: {
    ...mapState('dinein', ['tablesOnArea']),
  },
}
</script>
