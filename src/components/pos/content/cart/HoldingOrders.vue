<template>
  <div class="holding-order-panel animated zoomIn">
    <!--    <Header />-->
    <div class="wrappers-order-block show" v-if="holdOrderList">
      <Items
        v-for="(order, key) in holdOrderList"
        :orderData="order"
        :key="key"
      />
      <div class="pagination-customer-details">
        <paginate
          v-if="parms.totalPages"
          :page-count="parms.totalPages"
          :page-range="1"
          :margin-pages="1"
          :clickHandler="moreOrder"
          :prev-text="_t('Prev')"
          :next-text="_t('Next')"
          :container-class="'holdorders'"
          :page-class="_t('page-item')"
        >
        </paginate>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import paginate from 'vuejs-paginate'
// import Header from './holdingOrders/Header.vue'
import Items from './holdingOrders/Items.vue'

export default {
  name: 'HoldingOrders',
  components: {
    // Header,
    paginate,
    Items,
  },
  props: {},
  computed: {
    ...mapState({
      holdOrderList: state => state.holdOrders.getHoldOrders,
    }),
    ...mapState({
      parms: state => state.holdOrders.params,
    }),
  },
  methods: {
    moreOrder: function(pageNumber) {
      this.moreOrders(pageNumber)
    },
    ...mapActions('holdOrders', ['moreOrders']),
  },
}
</script>
