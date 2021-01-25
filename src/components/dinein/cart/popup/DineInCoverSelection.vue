<template>
  <div class="modal fade" id="dine-in-cover-selection" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <h4 class="customer-title color-text-invert">
            {{ _t('Select') + ' ' + _t('Cover') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div id="available-tables" class="available-tables cursor-pointer">
            <div class="table-status-container">
              <span
                class="table-status"
                style="text-align:center"
                :class="OrderSelectedCoverId == cover._id ? 'active' : ''"
                v-for="(cover, i) in covers"
                :key="cover._id + i"
                @click="setCover(cover)"
              >
                <span v-html="cover.name"></span>
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="discount-save-btn"
              data-dismiss="modal"
            >
              {{ _t('Ok') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'DineInCoverSelection',
  data() {
    return {
      OrderSelectedCover: 'Select Cover',
      OrderSelectedCoverId: '',
      defaultCover: '',
      isNewItem: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', ['selectedCover', 'covers']),
    ...mapState('order', ['items', 'orderId']),
  },
  watch: {
    items: function(element) {
      if (this.orderId != null) {
        this.isNewItem = element.filter(item => {
          return typeof item.coverNo === 'undefined' ? true : false
        })
        if (this.isNewItem.length > 0) {
          this.$store.commit('dinein/SET_COVER', false)
        } else {
          this.$store.commit('dinein/SET_COVER', this.defaultCover)
        }
      }
    },
  },
  mounted() {
    if (this.orderId == null) {
      this.defaultCover = this.covers.find(element => {
        return element.priority == 0
      })
      if (this.defaultCover) {
        this.OrderSelectedCover = this.defaultCover.name
        this.OrderSelectedCoverId = this.defaultCover._id
      }
      this.$store.commit('dinein/SET_COVER', this.defaultCover)
    }
  },
  methods: {
    setCover: function(cover) {
      if (cover) {
        this.OrderSelectedCover = cover.name
        this.OrderSelectedCoverId = cover._id
      }
      this.$store.commit('dinein/SET_COVER', cover)
    },
  },
}
</script>
<style lang="sass" scoped>
.error
    width: 100%
/*padding: 40px 5px 10px 5px*/
</style>
