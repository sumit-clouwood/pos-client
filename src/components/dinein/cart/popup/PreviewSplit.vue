<template>
  <div class="modal fade" id="preview-split-popup" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header split-bill-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Split') }} {{ _t('Bill') }}
          </h4>
        </div>
        <div class="modal-body">
          <div
            v-for="(itemNos, guests, billNo) in billSplit"
            :key="guests"
            class="row dining-options-block split-bill-block "
          >
            <div class="header">
              <div>{{ _t('Bill') }} #{{ billNo + 1 }}</div>
            </div>
            <div>
              <div class="select-items-option" v-if="orignalItems">
                <div
                  v-for="(item, index) in orignalItems"
                  :key="index + '-' + item._id"
                  class="split-bill-block"
                >
                  <div
                    class="main-orders-list-item color-dashboard-background"
                    v-if="itemNos.includes(index.toString())"
                  >
                    <div class="main-orders-list-item-title color-text">
                      <div class="orders-name">{{ dt(item) }}</div>
                    </div>

                    <div class="main-orders-list-item-buttons">
                      <Modifiers
                        v-bind:modifiers="item.modifiers"
                        v-if="item.modifiable"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="footer">
              <div>
                <button
                  v-if="orignalItems.length"
                  class="btn btn-success btn-large color-main color-text-invert"
                  type="button"
                  id="discount-save-btn"
                  @click="paySplit(itemNos)"
                >
                  {{ _t('Pay') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-danger btn-large color-text-invert color-button"
              type="button"
              data-dismiss="modal"
            >
              {{ _t('Close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End Select Discount -->
</template>

<script>
/* global hideModal */
import Modifiers from '@/components/pos/content/cart/newOrders/items/Modifiers.vue'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'PreviewSplit',
  components: {
    Modifiers,
  },
  props: {},
  computed: {
    ...mapGetters('order', ['orignalItems']),
    ...mapGetters('location', ['_t']),
    ...mapState('dinein', ['billSplit']),
  },
  methods: {
    paySplit(itemNos) {
      this.$store.commit('dinein/PROCESSING_SPLIT', true)
      this.$store.dispatch('order/splitItems', itemNos).then(() => {
        hideModal('#preview-split-popup')
        hideModal('#split-bill-popup')
      })
    },
  },
}
</script>
<style lang="sass" scoped>
.split-bill
  .header
    margin-top: 10px
    border-bottom: 1px solid #ccc

.split-bill-block
  display: grid;
  grid-gap: 1.25rem
  grid-template-columns: 1fr
  width: 100%
  padding-bottom: 10px
  margin-bottom: 10px

.table-status
  cursor: pointer
.footer
  padding-top: 5px
  padding-bottom: 5px
  margin-bottom: 5px
</style>
