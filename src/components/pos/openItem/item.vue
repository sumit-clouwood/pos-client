<template>
  <div class="modal fade" id="open-item" role="dialog" v-if="item">
    <div class="modal-dialog">
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <h4 class="customer-title color-text-invert">
            {{ _t('+ Add') + ' ' + _t('Open Item') }}
          </h4>
        </div>
        <div class="modal-body add-note-wrap ">
          <form autocomplete="off">
            <div class="add-note-area ">
              <p class="color-text">{{ _t('Price') }} ( {{ currency }} )</p>
              <input
                type="text"
                class="open-item price"
                v-model.number="vitem.value"
                placeholder="0.00"
                autocomplete="off"
              />
              <div class="validation-error" v-if="errors.value">
                {{ errors.value }}
              </div>
              <p class="color-text">
                {{ _t('Quantity') }}
              </p>
              <input
                type="text"
                class="open-item quantity"
                v-model.number="vitem.quantity"
                placeholder="Item Quantity"
                autocomplete="off"
              />
              <span class="qty-measurement-unit">
                {{ item.measurement_unit }}</span
              >
              <div class="validation-error" v-if="errors.name">
                {{ errors.name }}
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
            <button
              class="btn btn-success btn-large color-main "
              type="button"
              id="save-note"
              @click="addToCart"
            >
              {{ _t('Add') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global hideModal */
import { mapGetters, mapState } from 'vuex'
export default {
  data() {
    return {
      vitem: {
        quantity: '',
        value: '',
      },
      errors: {},
    }
  },
  computed: {
    ...mapState('location', ['currency']),
    ...mapState('category', ['item']),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    addToCart() {
      this.errors = {}

      if (!this.vitem.quantity) {
        this.errors.quantity = this._t('Please provide item quantity')
      }

      if (this.vitem.value < 0) {
        this.errors.value = this._t('Please provide item price')
      }

      if (Object.keys(this.errors).length !== 0) {
        return false
      }

      this.$store
        .dispatch('order/addOpenItem', {
          item: this.$store.state.category.item,
          data: this.vitem,
        })
        .then(() => {
          hideModal('#open-item')
          this.vitem = {}
        })
    },
  },
}
</script>
<style lang="sass" scoped>
.open-item
  width: 85%
  height: 3.125rem
  border-radius: 3px
  background-color: #ffffff
  border: solid 1px #e4e7eb
  padding: 0.625rem

.validation-error
  position: initial
  font-size: 0.95rem
</style>
