<template>
    <footer class="sticky-footer">
        <div class="container">
            <div class="dp-left-footer">
                <h2 id="dp-total-order">{{dispatchOrderCount}} {{ dispatchOrderCount == 1 ? 'order' : 'orders' }} </h2>
            </div>
            <div class="dp-right-footer">
                <paginate
                        v-if="dispatchOrderCount > 0"
                        :page-count="pageCount"
                        :page-range="1"
                        :margin-pages="1"
                        :clickHandler="setPageNumber"
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
import {mapState} from 'vuex'

export default {
  name: 'DSFooter',
  data(){
    return {
      pageCount: 1
    }
  },
  computed: {
    ...mapState('deliveryManager', ['dispatchOrderCount']),
  },
  components: {
    paginate,
  },
  methods: {
    setPageNumber: function () {

    },
  },
  updated() {
    this.pageCount = Math.ceil(this.dispatchOrderCount / 8)
  }
}
</script>

<style scoped lang="css">
    .dp-right-footer ul.ullist-dp > li > a {
     color:#fff !important;
}
</style>