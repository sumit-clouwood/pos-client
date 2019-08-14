<template>
  <div class="dine-in-tabel-wrapper">
    <div class="inner-dinein-table">
      <TableStatus />
      <div class="sitting-dinein-table ui-droppable" id="sitting-dinein-table">
        <div class="sitting-dine-wrap disable-sorting" v-if="tablesOnArea">
          <div
            class="sitting-image"
            @click="orderTypeWalkIn({ OTview: 'Dine In', OTApi: 'dine_in' })"
            :data-target="store"
          >
            <!--<router-link :to="store" class="text-white">
                            {{ _t('Walk-in') }}
                        </router-link>-->
            <svg
              :height="height + 'px'"
              :width="width + 'px'"
              id="dine-in-area"
              ref="dine-in-area"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          </div>
          <!--<div id="tooltip-c" class="tooltip-c">
                        <div class="tooltip-c-range" id="range"></div>
                        <button>move</button>
                        <button>edit</button>
                        <button>disable</button>
                    </div>-->
          <div
            class="dropdown-menu show tooltip-c"
            x-placement="bottom-start"
            id="tooltip-c"
            style="position: absolute; transform: translate3d(0px, 20px, 0px); top: 0px; left: 0px; will-change: transform;"
          >
            <!--get table id-->
            <!--<div class="tooltip-c-range" id="range"></div>-->
            <a
              class="dropdown-item"
              data-value="Table 3"
              href="#"
              v-for="(order, index) in orderOnTables.orderId"
              :key="index"
              >{{ order }}
            </a>
            <!--<a class="dropdown-item" data-value="Table 3 A" href="#"
              >Table 3 A</a
            >-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import * as d3 from 'd3'
import TableStatus from './TableStatus'
export default {
  name: 'TableDraw',
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', ['tablesOnArea', 'orderOnTables']),
    ...mapGetters('context', ['store']),
  },
  components: {
    TableStatus,
  },
  data() {
    return {
      page: null,
      svg: null,
      width: 960,
      height: 600,
      tooltip: null,
      svgWidth: 250,
      svgHeight: 100,
    }
  },
  mounted() {
    this.updateTableOnArea()
    // this.page = d3.select(this.$el).select('#dine-in-area')
    this.tooltip = d3.select(this.$el).select('#tooltip-c')
  },
  updated() {
    this.clearTableArea()
    this.updateTableOnArea()
  },
  methods: {
    clearTableArea() {
      d3.selectAll('#dine-in-area > g > *').remove()
    },
    orderTypeWalkIn: function(orderType) {
      this.$store.commit('order/ORDER_TYPE', orderType)
    },
    updateTableOnArea() {
      let dis = this
      this.page = d3.select(this.$el).select('#dine-in-area')
      this.svg = d3
        .select(this.$el)
        .select('#dine-in-area')
        .append('g')
        .attr('class', 'tables')
        .selectAll('.dinein_table')
        .data(this.tablesOnArea)
        .enter() //data from state tables
        .append('g')
        .attr('class', 'dinein_table_parent')
        .append('use')
        .attr('class', 'dinein_table')
        .attr('draggable', 'true')
        .attr('x', function(d) {
          return d.table_position_coordinate.x || 0
        })
        .attr('y', function(d) {
          return d.table_position_coordinate.y || 0
        })
        .attr('table_id', d => d._id)
        .attr('table_shape', d => d.table_shape)
        .attr('table_number', d => d.number)
        .attr('chairs', d => d.chairs)
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .attr('xlink:href', function(d) {
          return `#dinein_${d.table_shape}_${d.chairs}`
        })
        .on('click', (d, i, a) => this.showOptions(d))
        .attr('fill', 'green')

      d3.selectAll('.dinein_table_parent').each((d, i, a) => {
        d3.select(a[i])
          .append('text')
          .attr('class', 'dinein_table_number')
          .attr('x', function(d) {
            return (d.table_position_coordinate.x || 0) + dis.svgWidth / 2
          })
          .attr('y', function(d) {
            return (d.table_position_coordinate.y || 0) + dis.svgHeight / 2
          })
          .style('fill', 'black')
          .style('font-size', '15px')
          .attr('dy', '.35em')
          .attr('text-anchor', 'middle')
          .text(function(d) {
            return d.number
          })
      })
    },
    showOptions(datum) {
      this.tooltip.style('opacity', 1)
      this.tooltip.select('#range').text(datum._id)
      this.tooltip
        .style('left', datum.table_position_coordinate.x + 'px')
        .style('top', datum.table_position_coordinate.y + this.svgHeight + 'px')
    },
  },
}
</script>
<style scoped>
svg#dine-in-area {
  background: #f8fbff;
}
.stroke-svg {
  stroke: #d4dae5;
  stroke-width: 1;
}

.tooltip-c {
  position: absolute;
  opacity: 0;
  left: 0;
  padding: 0.6em 1em;
  background: lightgray;
  text-align: center;
  border: 1px solid #ddd;
  box-shadow: 0 6px 8px rgba(52, 73, 94, 0.2), 0 1px 1px rgba(52, 73, 94, 0.1);
  z-index: 20;
  transition: all 0.2s ease-out;
  pointer-events: none;
}

.tooltip-c-range {
  margin-bottom: 0;
  font-weight: 600;
}
</style>
