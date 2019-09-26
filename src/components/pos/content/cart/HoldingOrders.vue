<template>
  <div class="holding-order-panel animated zoomIn">
    <!--    <Header />-->
    <Preloader v-if="!loading" />
    <div class="wrappers-order-block show" v-else>
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
    <div class="error color-warning" v-if="holdOrderList.length == 0">
      <span class="text-danger text-center color-warning">
        {{ _t('Nothing found.') }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import paginate from 'vuejs-paginate'
import Preloader from '@/components/util/Preloader'

// import Header from './holdingOrders/Header.vue'
import Items from './holdingOrders/Items.vue'

export default {
  name: 'HoldingOrders',
  components: {
    // Header,
    paginate,
    Items,
    Preloader,
  },
  props: {},
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState({
      holdOrderList: state => state.holdOrders.getHoldOrders,
    }),
    ...mapState('holdOrders', ['loading']),
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
<style lang="scss">
@import '../../../../assets/scss/pixels_rem.scss';
@import '../../../../assets/scss/variables.scss';
@import '../../../../assets/scss/mixins.scss';
@include responsive(mobile) {
  .wrappers-order-block {
    padding: 20px;
  }
}
</style>
