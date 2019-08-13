<template>
    <div class="dine-in-tabel-wrapper">
        <div class="inner-dinein-table">
            <TableStatus/>
            <div class="sitting-dinein-table ui-droppable" id="sitting-dinein-table">
                <div class="sitting-dine-wrap disable-sorting">
                    <div class="sitting-image"  @click="orderTypeWalkIn({ OTview: 'Walk In', OTApi: 'walk_in' })" :data-target="store">
                        <!--<router-link :to="store" class="text-white">
                            {{ _t('Walk-in') }}
                        </router-link>-->
                        <svg
                            :height="height+'px'"
                            :width="width+'px'"
                            id="dine-in-area"
                            ref="dine-in-area"
                            xmlns="http://www.w3.org/2000/svg"></svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
/*  global  $ */
import {mapGetters, mapState} from 'vuex'
import * as d3 from 'd3'
import TableStatus from './TableStatus'
export default {
    name: 'TableDraw',
    computed: {
      ...mapGetters('location', ['_t']),
      ...mapState('dinein', ['tablesOnArea']),
      ...mapGetters('context', ['store']),
    },
    components: {
      TableStatus,
    },
    data () {
        return {
          page: null,
          svg: null,
          width: 960,
          height: 600,
        }
    },
    mounted() {
       this.updateTableOnArea()
    },
  updated() {
    $('#dine-in-area').empty()
    this.updateTableOnArea()
  },
  methods:{
    orderTypeWalkIn: function(orderType) {
      this.$store.commit('order/ORDER_TYPE', orderType)
    },
    updateTableOnArea() {
      this.page = d3
        .select(this.$el)
        .select('#dine-in-area')

      this.svg = d3
        .select(this.$el)
        .select('#dine-in-area')
        .append('g')
        .attr('class', 'tables')
        .selectAll('.dinein_table')
        .data(this.tablesOnArea) //data from state tables
        .enter()
        .append('use')
        .attr('class', 'dinein_table')
        .attr('x', function (d) {
          console.log(d.table_position_coordinate)
          return typeof d.table_position_coordinate.x != 'undefined' ? d.table_position_coordinate.x : 0
        })
        .attr('y', function (d) {
          return typeof d.table_position_coordinate.y != 'undefined' ? d.table_position_coordinate.y : 0
        })
        .attr('width', 250)
        .attr('height', 100)
        .attr('xlink:href', function (d) {
          return `#dinein_${d.table_shape}_${d.chairs}`
        }).attr('fill', 'green')
    }
  }
}
</script>
<style scoped>
    svg#dine-in-area {
        background:#f8fbff;
    }
    .stroke-svg {
     stroke: #d4dae5;
     stroke-width: 1;
    }
</style>