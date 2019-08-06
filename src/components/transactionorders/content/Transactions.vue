<template>
  <div class="main-body-transaction color-dashboard-background color-text">
    <div class="search-trans-wrapper">
      <div class="back-trans-button">
        <button class="btn btn-success">&lt; Back</button>
      </div>
      <search />
    </div>
    <div :class="['food-wrapper', subCategoryHendler ? 'active' : 'notActive']">
      <Orderlist v-if="!transactionorders" />
      <div class="food-block" v-else>
        <div class="text-danger">
          {{ _t('Nothing found to order.') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from './catalog/Search'
import Orderlist from './catalog/Orderlist'
import { mapGetters } from 'vuex'

export default {
  name: 'Catalog',
  props: {
    msg: String,
  },
  components: {
    Search,
    Orderlist,
  },
  computed: {
    ...mapGetters(['subCategoryHendler', 'transactionorders']),
    ...mapGetters('location', ['_t']),
  },
}
</script>
