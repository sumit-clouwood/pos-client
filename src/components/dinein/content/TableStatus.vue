<template>
  <div class="dinein-table-control">
    <div class="dinein-seat-available">
      <ul class="ullist-dinein-table" v-if="tableStatus">
        <li id="reserved-seat">
          <span>{{ tableStatus.emptyTableCount }}</span
          >{{ _t('Reserved') }}
        </li>
        <li id="unavailable-seat">
          <span class="merged-tables">M</span>
          <span>{{ tableStatus.unavailableCount }}</span
          >{{ _t('Unavailable') }}
        </li>
        <li id="available-soon-seat">
          <span>{{ tableStatus.availableSoonCount }}</span
          >{{ _t('Available&nbsp;Soon') }}
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
        <span class="qty">{{ zoomPercent }}</span>
        <button class="qtyplus value-qty" @click="zoomIn()">+</button>
      </div>
      <div class="round-dinein-circle">
        <span id="dine-top" @click="moveUp()">
          <img
            src="https://d3jjfdwi6rnqlf.cloudfront.net/img/dinein/chairs/dine-top.svg"
          />
        </span>
        <span id="dine-left" @click="moveLeft()">
          <img
            src="https://d3jjfdwi6rnqlf.cloudfront.net/img/dinein/chairs/dine-left.svg"
          />
        </span>
        <span id="dine-right" @click="moveRight()">
          <img
            src="https://d3jjfdwi6rnqlf.cloudfront.net/img/dinein/chairs/dine-right.svg"
          />
        </span>
        <span id="dine-bottom" @click="moveDown()">
          <img
            src="https://d3jjfdwi6rnqlf.cloudfront.net/img/dinein/chairs/dine-bottom.svg"
          />
        </span>
        <div class="inner-round">
          <div class="sub-inner-round"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapState, mapGetters } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'TableStatus',
  computed: {
    ...mapState('dinein', ['tableStatus', 'tableZoomScale']),
    ...mapGetters('location', ['_t']),
  },
  data() {
    return {
      transform: {
        x: 0,
        y: 0,
        k: 0.4,
      },
      zoomPercent: 100,
    }
  },
  updated() {
    if (this.tableZoomScale === 0.4) {
      this.zoomPercent = 100
    }
  },
  methods: {
    rotationAlgo(a, i, d) {
      let nodeDims = d3
        .select(a[i])
        .node()
        .parentNode.getBBox()
      let data = d
      let x = parseFloat(data.table_position_coordinate.x)
      let y = parseFloat(data.table_position_coordinate.y)
      let midX = nodeDims.width / 14 + x
      let midY = nodeDims.height / 12 + y
      return { data, midX, midY }
    },
    /*zoomIn() {
      let that = this
      that.transform.k += 0.1
      if (that.transform.k > 0.9) {
        that.transform.k -= 0.1
        return true
      }
      d3.selectAll('.dinein_table_parent').each((d, i, a) => {
        var transform = d3.zoomIdentity
            .scale(that.transform.k)
            .translate(that.transform.x, that.transform.y)
        d3.select(a[i]).attr('transform', transform)
      })
    },
    zoomOut() {
      let that = this
      that.transform.k -= 0.1
      if (that.transform.k < 0.4) {
        that.transform.k = 0.4
        return true
      }
      d3.selectAll('.dinein_table_parent').each((d, i, a) => {
        let transform = d3.zoomIdentity
            .scale(that.transform.k)
            .translate(that.transform.x, that.transform.y)
        d3.select(a[i]).attr('transform', transform)
      })
    },*/
    zoomIn() {
      let that = this
      if (that.transform.k < 0.9) {
        $('#tooltipdata').hide()
        that.transform.k += 0.1

        d3.selectAll('.dinein_table_parent').each((d, i, a) => {
          let { data, midX, midY } = that.rotationAlgo(a, i, d)
          let transform = d3.zoomIdentity
            .scale(that.transform.k)
            .translate(that.transform.x, that.transform.y)
          d3.select(a[i]).attr(
            'transform',
            transform +
              `rotate(${data.table_position_coordinate.angle},${midX},${midY})`
          )
        })
        that.zoomPercent += 10
        that.$store.commit('dinein/TABLE_SCALE', that.transform.k)
      }
    },
    zoomOut() {
      let that = this
      if (that.transform.k > 0.41) {
        $('#tooltipdata').hide()
        that.transform.k -= 0.1
        d3.selectAll('.dinein_table_parent').each((d, i, a) => {
          let { data, midX, midY } = that.rotationAlgo(a, i, d)
          let transform = d3.zoomIdentity
            .scale(that.transform.k)
            .translate(that.transform.x, that.transform.y)
          d3.select(a[i]).attr(
            'transform',
            transform +
              `rotate(${data.table_position_coordinate.angle},${midX},${midY})`
          )
        })
        that.zoomPercent -= 10
        that.$store.commit('dinein/TABLE_SCALE', that.transform.k)
      }
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
        let { data, midX, midY } = that.rotationAlgo(a, i, d)
        let transform = d3.zoomIdentity
          .scale(that.transform.k)
          .translate(that.transform.x, that.transform.y)
        d3.select(a[i]).attr(
          'transform',
          transform +
            `rotate(${data.table_position_coordinate.angle},${midX},${midY})`
        )
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
        let { data, midX, midY } = that.rotationAlgo(a, i, d)
        let transform = d3.zoomIdentity
          .scale(that.transform.k)
          .translate(that.transform.x, that.transform.y)
        d3.select(a[i]).attr(
          'transform',
          transform +
            `rotate(${data.table_position_coordinate.angle},${midX},${midY})`
        )
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
        let { data, midX, midY } = that.rotationAlgo(a, i, d)
        let transform = d3.zoomIdentity
          .scale(that.transform.k)
          .translate(that.transform.x, that.transform.y)
        d3.select(a[i]).attr(
          'transform',
          transform +
            `rotate(${data.table_position_coordinate.angle},${midX},${midY})`
        )
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
        let { data, midX, midY } = that.rotationAlgo(a, i, d)
        let transform = d3.zoomIdentity
          .scale(that.transform.k)
          .translate(that.transform.x, that.transform.y)
        d3.select(a[i]).attr(
          'transform',
          transform +
            `rotate(${data.table_position_coordinate.angle},${midX},${midY})`
        )
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
          (tableStatus.unavailableCount +
            tableStatus.availableSoonCount +
            tableStatus.emptyTableCount)
      }
      return tableCount
    },
  },
}
</script>
<style scoped lang="scss">
.merged-tables {
  background-color: #d5abab !important;
}
</style>
