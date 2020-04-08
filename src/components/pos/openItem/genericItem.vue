<template>
  <div class="modal fade" id="generic-open-item" role="dialog">
    <div class="modal-dialog  modal-dialog-centered">
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <h4 class="customer-title color-text-invert">
            {{ _t('+ Add') + ' ' + _t('Open Item') }}
          </h4>
        </div>
        <div class="modal-body add-note-wrap ">
          <form autocomplete="off">
            <div class="add-note-area ">
              <p class="color-text">
                {{ _t('Item Name') }}
              </p>
              <input
                type="text"
                class="open-item name"
                v-model="item.name"
                placeholder="Name"
                autocomplete="off"
              />
              <div class="validation-error" v-if="errors.name">
                {{ errors.name }}
              </div>
              <p class="color-text">{{ _t('Price') }} ( {{ currency }} )</p>
              <input
                type="text"
                class="open-item price"
                v-model="item.value"
                placeholder="0.00"
                autocomplete="off"
              />
              <div class="validation-error" v-if="errors.value">
                {{ errors.value }}
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
              {{ _t('Save') }}
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
      item: {
        name: '',
        value: '',
        type: 'genericOpenItem',
      },
      errors: {},
    }
  },
  computed: {
    ...mapState('location', ['currency']),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    addToCart() {
      this.errors = {}

      if (!this.item.name) {
        this.errors.name = this._t('Please provide item name')
      }

      if (!this.item.value) {
        this.errors.value = this._t('Please provide item price')
      }

      if (Object.keys(this.errors).length !== 0) {
        return false
      }

      this.$store
        .dispatch('order/addOpenItem', { item: {}, data: this.item })
        .then(() => {
          this.item.name = ''
          this.item.value = ''
          hideModal('#generic-open-item')
        })
    },
  },
}
</script>
<style lang="sass" scoped>
.open-item
  width: 100%
  height: 3.125rem
  border-radius: 3px
  background-color: #ffffff
  border: solid 1px #e4e7eb
  padding: 0.625rem
.validation-error
  position: initial
  font-size: 0.95rem
</style>
