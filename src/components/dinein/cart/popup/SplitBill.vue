<template>
  <div class="modal fade" id="split-bill-popup" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header split-bill-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Split') }} {{ _t('Bill') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block split-bill">
          <div class="split-bill-block header">
            <div>
              <p>{{ _t('Items') }}</p>
            </div>
            <div>
              <p>{{ _t('Guests') }}</p>
            </div>
          </div>
          <div class="select-items-option" v-if="items">
            <div
              v-for="(item, index) in items"
              :key="index + '-' + item._id"
              class="split-bill-block"
            >
              <div class="main-orders-list-item color-dashboard-background">
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

              <div id="available-tables">
                <div class="table-status-container">
                  <div
                    class="table-status"
                    :class="{ active: guestInBillItem(item, guest) }"
                    style="text-align:center"
                    v-for="guest in guests"
                    :key="guest"
                    @click="selectGuest(item, guest)"
                  >
                    <span>{{ guest }} </span>
                  </div>
                </div>
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

            <button
              v-if="items.length"
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="discount-save-btn"
              @click="splitBill"
            >
              {{ _t('Ok') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End Select Discount -->
</template>

<script>
import Modifiers from '@/components/pos/content/cart/newOrders/items/Modifiers.vue'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'SplitBill',
  components: {
    Modifiers,
  },
  props: {},
  computed: {
    ...mapState('order', ['items']),
    ...mapGetters('location', ['_t']),
    ...mapGetters('dinein', ['guestInBillItem']),
    ...mapState('dinein', ['guests', 'bills']),
  },
  methods: {
    ...mapActions('dinein', ['splitBill']),

    selectGuest(item, guest) {
      this.$store.dispatch('dinein/updateItemGuest', {
        item: item.orderIndex,
        guest: guest,
      })
    },
  },
}
</script>
<style lang="sass" scoped>
.split-bill
  .header
    border-bottom: 1px solid #ccc

.split-bill-block
  display: grid;
  grid-gap: 1.25rem
  grid-template-columns: 1fr 1fr
  width: 100%
  border-bottom: 1px solid #ccc
  padding-bottom: 10px
  margin-bottom: 10px

.table-status
  cursor: pointer
</style>
