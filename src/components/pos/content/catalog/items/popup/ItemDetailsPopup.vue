<template>
  <div
    class="modal fade"
    id="item-details-popup"
    tabindex="-1"
    role="dialog"
    aria-labelledby="item-details-popup"
    aria-hidden="true"
    v-if="currentItem"
    data-keyboard="false"
    data-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content color-dashboard-background">
        <div class="modal-body">
          <div
            class="image-container"
            v-if="currentItem && currentItem.image !== ''"
          >
            <button
              type="button"
              class="close"
              style="text-align:end;
            padding-right:1rem;
            color:black;
            font-size:2rem;
          "
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <img
              style="width: 100%; height:450px; border-radius: 10px;"
              :src="currentImageUrl"
              :alt="currentItem.name"
              @error="imageLoadError"
            />
          </div>
          <div class="content-container">
            <div class="item-one-line item-name-price-container">
              <div class="item-name font-weight-bold">
                {{ dt(currentItem) }}
              </div>
              <div class="item-price">
                {{ currency }} {{ currentItem.value }}
              </div>
            </div>
            <div
              class="item-description item-one-line"
              v-if="currentItem.description"
              :style="{ textAlign: alignText }"
            >
              {{ dt(currentItem, 'description') || '' }}
            </div>
            <modifiers-content v-if="hasModifiers" />
            <div class="modal-footer">
              <button
                type="button"
                class="add-to-cart-btn btn btn-success btn-large color-main color-text-invert font-weight-bold"
                @click.prevent="addToOrder(currentItem)"
              >
                {{ _t('ADD TO CART') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $, showModal, hideModal */
import { mapState, mapGetters } from 'vuex'
import bootstrap from '@/bootstrap'
import ModifiersContent from '@/components/pos/content/catalog/items/popup/Content.vue'
import Scroll from '@/mixins/Scroll'
export default {
  name: 'ItemDetailsPopup',
  components: {
    ModifiersContent,
  },
  mixins: [Scroll],
  props: {
    currentItem: {
      type: Object,
      required: true,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      currentImagePath: '',
      alignText: 'left !important',
    }
  },
  watch: {
    currentItem(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.filterImage()
          this.alignTextProperly()
        })
      }
    },
  },
  computed: {
    ...mapState('location', ['currency']),
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['splitBill']),
    ...mapGetters(['foodMenuHendler', 'bascketItems']),
    currentImageUrl() {
      return this.currentImagePath
    },
    hasModifiers() {
      return this.$store.getters['modifier/hasModifiers'](this.currentItem)
    },
  },

  methods: {
    alignTextProperly() {
      if (
        this.$store.state.location.locale === 'ar-AE' &&
        this.currentItem.description
      ) {
        if (
          this.dt(this.currentItem, 'description') !==
          this.currentItem.description
        ) {
          this.alignText = 'right !important'
        } else {
          this.alignText = 'left !important'
        }
      }
    },
    filterImage() {
      const imageUrl = this.currentItem.image
      if (this.currentItem && imageUrl) {
        if (this.hasModifiers) {
          this.$store.dispatch(
            'modifier/assignModifiersToItem',
            this.currentItem
          )
        }
        let url = imageUrl.split('menu/')
        this.currentImagePath = url[0] + 'menu/large/' + url[1]
      }
    },
    addToOrder(item) {
      if (this.splitBill) {
        return false
      }
      this.$store.commit('order/RESET_SPLIT_BILL')
      if (!this.$store.state.order.items.length) {
        this.$store.commit('sync/reload', true)
        bootstrap.loadUI('orderStart').then(() => {})
      }

      this.$store.commit('order/SET_CART_TYPE', 'new')
      this.$store.dispatch('order/startOrder')
      $('#POSItemOptions .modifier-option-radio').prop('checked', false)
      $('.food-menu-item').removeClass('active')
      $(this).addClass('active')
      let cat = this.$store.getters['category/categories'].filter(
        data => data._id === item.category
      )
      let subcat = this.$store.getters['category/subcategories'].filter(
        data => data._id === item.sub_category
      )
      if (typeof cat !== 'undefined') {
        // this.$store.commit('category/SET_CATEGORY', cat[0])
      }
      if (typeof subcat !== 'undefined') {
        // this.$store.commit('category/SET_SUBCATEGORY', subcat[0])
      }
      this.$store.commit('category/SET_ITEM', item)
      this.$store.commit('checkoutForm/showCalc', true)
      this.$store.commit('orderForm/updateQuantity', 1)
      if (this.hasModifiers) {
        this.$store
          .dispatch('order/addModifierOrder')
          .then()
          .catch()
      } else {
        if (item.open_item === true) {
          showModal('#open-item')
        } else {
          this.$store.dispatch('order/addToOrder', item)
        }
      }

      this.$store.dispatch('addItemFood', item)

      if (!this.bascketItems.find(x => x.name === item.name)) {
        this.bascketItems.push({ name: item.name, count: 1, class: 'active' })
      } else {
        this.bascketItems.find(x => x.name === item.name).count++
      }
      hideModal('#item-details-popup')
    },
    imageLoadError() {
      this.currentImagePath = this.currentItem.image
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
#item-details-popup {
  .modal-dialog {
    ::-webkit-scrollbar {
      width: 0rem !important;
      height: 0.625rem !important;
    }
    max-width: 650px;
    border-radius: 5px !important;
    .close {
      line-height: normal;
      opacity: 1;
    }
    .modal-header {
      padding: 0 1.875rem;
      margin: 0px;
      border: none;
    }
    .modal-body {
      padding: 0.5rem !important;
      padding-bottom: 0px !important;
      background-color: #f2f2f2 !important;
    }
    .positemoption_body {
      padding: 0 1.875rem !important;
    }
    @include responsive(mobile) {
      display: none !important;
    }
    .content-container {
      width: 100%;
      background-color: white;
      border-radius: 12px;
      position: relative;
      top: -17px;
      .item-one-line {
        display: grid;
        grid-template-columns: 1fr;
        margin: 0.7rem 0rem;
        text-align: center;
        .item-name-price-container {
          grid-template-columns: 5fr 1fr;
        }
        .item-price {
          color: crimson;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .item-name {
          font-size: 2rem;
          margin-top: 1rem;
        }
      }
      .item-description {
        width: 90%;
        font-size: 1.2rem;
        color: black;
        margin: auto !important;
        padding-bottom: 1rem;
      }
      #modifiers-popup {
        max-height: 300px;
        overflow-y: auto;
        border-top: 0.5px solid rgba(165, 42, 42, 0.3);
        .modal-body {
          width: 90% !important;
          margin: auto !important;
          border-radius: 5px !important;
        }
      }
    }
    // .image-container {
    //   display: flex;
    //   flex-flow: column;
    // }
    .modal-footer {
      padding: 0px;
      display: grid;
      grid-template-columns: 1fr !important;
      height: auto;
      button {
        width: 100%;
        border-radius: 0px;
      }
      .add-to-cart-btn {
        height: 3rem;
        border-radius: 0 0 0.7rem 0.7rem;
        font-size: 16px;
      }
    }
  }
}
</style>
