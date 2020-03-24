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
      <div
        class="modal-content color-dashboard-background"
        :style="{
          width: currentItem.image == '' ? '70%' : '100%',
          margin: currentItem.image == '' ? 'auto' : 'none',
        }"
      >
        <div
          class="modal-body"
          :style="{
            gridTemplateColumns: currentItem.image == '' ? '1fr' : '1fr 1fr',
            minHeight: currentItem.image == '' ? '20rem' : 'none',
          }"
        >
          <div
            class="image-container"
            v-if="currentItem && currentItem.image !== ''"
          >
            <!-- <Preloader v-if="loading" /> -->
            <img
              style="width: 100%; height:100%;"
              :src="currentImageUrl"
              :alt="currentItem.name"
              @error="imageLoadError"
            />
          </div>
          <div class="content-container">
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
              @click.prevent="$emit('resetCurrentItem', {})"
            >
              <span aria-hidden="true">&times;</span>
            </button>
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
// import Preloader from '@/components/util/Preloader'
export default {
  name: 'ItemDetailsPopup',
  components: {
    ModifiersContent,
    // Preloader,
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
      // loading: true,
    }
  },
  watch: {
    currentItem(newVal) {
      if (!$.isEmptyObject(newVal)) {
        this.$nextTick(() => {
          // this.loading = true
          this.getImage()
          this.alignTextProperly()
          this.assignModifiers()
          // setTimeout(() => {
          //   this.loading = false
          // }, 1500)
        })
      }
    },
  },
  computed: {
    ...mapState('location', ['currency', 'availableLanguages']),
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
      let language = this.availableLanguages.find(
        lang => lang.code === this.$store.state.location.locale
      )
      if (language && this.currentItem.description) {
        if (
          this.dt(this.currentItem, 'description') !==
          this.currentItem.description
        ) {
          if (language.direction === 'rtl') this.alignText = 'right !important'
          else this.alignText = 'left !important'
        } else {
          this.alignText = 'left !important'
        }
      }
    },
    getImage() {
      if (this.currentItem && this.currentItem.image) {
        let url = this.currentItem.image.split('menu/')
        this.currentImagePath = url[0] + 'menu/large/' + url[1]
      }
    },
    assignModifiers() {
      if (this.hasModifiers) {
        $('#modifiers-popup .modifier-option-radio').prop('checked', false)
        this.$store.dispatch('modifier/assignModifiersToItem', this.currentItem)
        this.$store.commit('orderForm/clearSelection')
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
      $('.food-menu-item').removeClass('active')
      $(this).addClass('active')

      this.$store.commit('category/SET_ITEM', item)
      this.$store.commit('checkoutForm/showCalc', true)
      this.$store.commit('orderForm/updateQuantity', 1)
      if (this.hasModifiers) {
        this.$store
          .dispatch('order/addModifierOrder')
          .then(() => {
            this.$emit('resetCurrentItem', {})
            hideModal('#item-details-popup')
          })
          .catch()
      } else {
        if (item.open_item === true) {
          showModal('#open-item')
        } else {
          this.$store.dispatch('order/addToOrder', item).then(() => {
            hideModal('#item-details-popup')
          })
        }
      }

      this.$store.dispatch('addItemFood', item)

      if (!this.bascketItems.find(x => x.name === item.name)) {
        this.bascketItems.push({ name: item.name, count: 1, class: 'active' })
      } else {
        this.bascketItems.find(x => x.name === item.name).count++
      }
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
  @include responsive(mobile) {
    display: none !important;
  }
  .modal-dialog {
    ::-webkit-scrollbar {
      width: 0rem !important;
      height: 0.625rem !important;
    }
    max-width: 90vw !important;
    .close {
      line-height: normal;
      opacity: 1;
    }
    .modal-body {
      padding: 0.5rem !important;
      background-color: #f2f2f2 !important;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .positemoption_body {
      padding: 0 1.875rem !important;
    }

    .content-container {
      width: 100%;
      background-color: white;
      position: relative;
      border-left: 0.5px solid rgba(0, 0, 0, 0.3);
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
        max-height: 350px;
        overflow-y: auto;
        border-top: 0.5px solid rgba(165, 42, 42, 0.3);
        border-bottom: 0.5px solid rgba(165, 42, 42, 0.3);
        .modal-body {
          width: 90% !important;
          margin: auto !important;
          border-radius: 5px !important;
        }
      }
    }
    .modal-footer {
      padding: 0px;
      display: grid;
      grid-template-columns: 1fr !important;
      height: 3rem;
      button {
        width: 100%;
        border-radius: 0px;
      }
      .add-to-cart-btn {
        height: 4rem;
        font-size: 16px;
        position: absolute;
        bottom: 0px;
        z-index: 999;
      }
      .add-to-cart-btn::before {
        font-family: fontAwesome;
        content: '\f217\00a0';
        font-size: 1.6rem;
        margin-right: 1rem;
      }
    }
  }
}
</style>
