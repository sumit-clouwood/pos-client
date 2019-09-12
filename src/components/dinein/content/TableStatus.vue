<template>
  <div class="dinein-table-control">
    <div class="dinein-seat-available">
      <ul class="ullist-dinein-table" v-if="tableStatus">
        <li id="unavailable-seat">
          <span>{{ tableStatus.unavailableCount }}</span
          >{{ _t('Unavailable') }}
        </li>
        <li id="available-soon-seat">
          <span>{{ tableStatus.availableSoonCount }}</span
          >{{ _t('Available Soon') }}
        </li>
        <li id="available-seat">
          <span>{{ getAvailableTableCount(tableStatus) }}</span
          >{{ _t('Available') }}
        </li>
      </ul>
    </div>
    <div class="zoom-wrap-dinein">
      <div class="POSItemOptions_quantity_inputs">
        <button class="qtyminus value-qty" @click="zoomOut()">-</button>
        <input
          class="qty"
          min="1"
          name="quantity"
          type="text"
          :value="zoomPercent"
        />
        <button class="qtyplus value-qty" @click="zoomIn()">+</button>
      </div>
      <div class="round-dinein-circle">
        <span id="dine-top" @click="moveUp()">
          <img src="img/dinein/chairs/dine-top.svg" />
        </span>
        <span id="dine-left" @click="moveLeft()">
          <img src="img/dinein/chairs/dine-left.svg" />
        </span>
        <span id="dine-right" @click="moveRight()">
          <img src="img/dinein/chairs/dine-right.svg" />
        </span>
        <span id="dine-bottom" @click="moveDown()">
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
import { mapState, mapGetters } from 'vuex'
import * as d3 from 'd3'
export default {
  name: 'TableStatus',
  computed: {
    ...mapState('dinein', ['tableStatus']),
    ...mapGetters('location', ['_t']),
  },
  data() {
    return {
      transform: {
        x: 0,
        y: 0,
        k: 1,
      },
      zoomPercent: 100,
    }
  },
  methods: {
    zoomIn() {
      let that = this
      that.transform.k += 0.2
      d3.selectAll('.dinein_table_parent').each((d, i, a) => {
        let transform = d3.zoomIdentity
          .scale(that.transform.k)
          .translate(that.transform.x, that.transform.y)
        d3.select(a[i]).attr('transform', transform)
      })
      that.zoomPercent += 10
    },
    zoomOut() {
      let that = this
      that.transform.k -= 0.2
      d3.selectAll('.dinein_table_parent').each((d, i, a) => {
        let transform = d3.zoomIdentity
          .scale(that.transform.k)
          .translate(that.transform.x, that.transform.y)
        d3.select(a[i]).attr('transform', transform)
      })
      that.zoomPercent -= 10
    },
    moveRight() {
      let that = this
      that.transform.x += 10
      this.getNewCoordinates(
        document.getElementById('tooltipdata').style.left,
        'increase',
        'left'
      )
      d3.selectAll('.dinein_table_parent').each((d, i, a) => {
        let transform = d3.zoomIdentity
          .scale(that.transform.k)
          .translate(that.transform.x, that.transform.y)
        d3.select(a[i]).attr('transform', transform)
      })
    },
    moveLeft() {
      this.getNewCoordinates(
        document.getElementById('tooltipdata').style.left,
        '',
        'left'
      )
      let that = this
      that.transform.x -= 10
      d3.selectAll('.dinein_table_parent').each((d, i, a) => {
        let transform = d3.zoomIdentity
          .scale(that.transform.k)
          .translate(that.transform.x, that.transform.y)
        d3.select(a[i]).attr('transform', transform)
      })
    },
    moveUp() {
      this.getNewCoordinates(
        document.getElementById('tooltipdata').style.top,
        '',
        ''
      )
      let that = this
      that.transform.y -= 10
      d3.selectAll('.dinein_table_parent').each((d, i, a) => {
        let transform = d3.zoomIdentity
          .scale(that.transform.k)
          .translate(that.transform.x, that.transform.y)
        d3.select(a[i]).attr('transform', transform)
      })
    },
    moveDown() {
      let that = this
      that.transform.y += 10
      this.getNewCoordinates(
        document.getElementById('tooltipdata').style.top,
        'increase',
        ''
      )
      d3.selectAll('.dinein_table_parent').each((d, i, a) => {
        let transform = d3.zoomIdentity
          .scale(that.transform.k)
          .translate(that.transform.x, that.transform.y)
        d3.select(a[i]).attr('transform', transform)
      })
    },

    getNewCoordinates(positionObj, iteration, moveSide) {
      let newValue = 0
      let valueInPX = positionObj.split('px')
      if (iteration === 'increase') {
        newValue +=
          typeof valueInPX[0] != 'undefined' ? parseInt(valueInPX[0]) + 10 : 0
      } else {
        newValue =
          typeof valueInPX[0] != 'undefined' ? parseInt(valueInPX[0]) - 10 : 0
      }
      if (moveSide === 'left') {
        document.getElementById('tooltipdata').style.left = newValue + 'px'
      } else {
        document.getElementById('tooltipdata').style.top = newValue + 'px'
      }
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
