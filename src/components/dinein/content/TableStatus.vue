<template>
  <div class="dinein-table-control">
    <div class="dinein-seat-available">
      <ul class="ullist-dinein-table" v-if="tableStatus">
        <li id="unavailable-seat">
          <span>{{ tableStatus.unavailableCount }}</span
          >Unavailable
        </li>
        <li id="available-soon-seat">
          <span>{{ tableStatus.availableSoonCount }}</span
          >Available Soon
        </li>
        <li id="available-seat">
          <span>{{ getAvailableTableCount(tableStatus) }}</span
          >Available
        </li>
      </ul>
    </div>
    <div class="zoom-wrap-dinein">
      <div class="POSItemOptions_quantity_inputs">
        <button class="qtyminus value-qty">-</button>
        <input class="qty" min="1" name="quantity" type="text" value="100" />
        <button class="qtyplus value-qty">+</button>
      </div>
      <div class="round-dinein-circle">
        <span id="dine-top" @click="moveTable('-=50', 'top')">
          <img src="img/dinein/chairs/dine-top.svg" />
        </span>
        <span id="dine-left" @click="moveTable('-=50', 'left')">
          <img src="img/dinein/chairs/dine-left.svg" />
        </span>
        <span id="dine-right" @click="moveTable('+=50', 'right')">
          <img src="img/dinein/chairs/dine-right.svg" />
        </span>
        <span id="dine-bottom" @click="moveTable('+=50', 'bottom')">
          <img src="img/dinein/chairs/dine-bottom.svg" />
        </span>
        <div class="inner-round">
          <div class="sub-inner-round"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
/* global moveTables */
export default {
  name: 'TableStatus',
  computed: {
    ...mapState('dinein', ['tableStatus']),
  },
  methods: {
    moveTable(px, movingSide) {
      moveTables(px, movingSide)
    },
    getAvailableTableCount(tableStatus) {
      let tableCount = 0
      if (tableStatus.availableCount > 0) {
        tableCount =
          tableStatus.availableCount -
          (tableStatus.unavailableCount + tableStatus.availableSoonCount)
      }
      return tableCount
    },
  },
}
</script>
