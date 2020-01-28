<template>
  <footer class="sticky-footer">
    <div class="container">
      <div class="dp-left-footer">
        <h2 id="dp-total-order">
          {{ dispatchOrderCount }}
          {{ dispatchOrderCount == 1 ? 'order' : 'orders' }}
        </h2>
      </div>

      <div class="dp-right-footer">
        <ul class="ullist-dp">
          <li class="dp-zoom-scren list-style-type">
            <img src="img/other/expand.png" />
          </li>
        </ul>
        <paginate
          v-if="dispatchOrderCount > 0"
          :page-count="pageCount"
          :page-range="1"
          :margin-pages="1"
          :clickHandler="updateDispatchPageNumber"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'ullist-dp'"
        >
        </paginate>
      </div>
    </div>
  </footer>
</template>

<script>
import paginate from 'vuejs-paginate'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DSFooter',
  data() {
    return {
      pageCount: 1,
    }
  },
  computed: {
    ...mapState('deliveryManager', ['dispatchOrderCount']),
  },
  components: {
    paginate,
  },
  methods: {
    /*setPageNumber: function () {
      this.$store.dispatch('deliverManager/updateDispatchPageNumber', pageNumber)
    },*/
    ...mapActions('deliveryManager', ['updateDispatchPageNumber']),
  },
  updated() {
    this.pageCount = 1 //Math.ceil(this.dispatchOrderCount / 8)
  },
}
</script>

<style scoped lang="css">
.dp-right-footer ul.ullist-dp > li > a {
  color: #fff !important;
}
.list-style-type {
  list-style-type: none;
}
.dp-right-footer > ul {
  display: inline-block;
}
</style>
