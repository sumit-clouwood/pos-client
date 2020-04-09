<template>
  <div class="modal-body color-dashboard-background grid_combo_item_content">
    <div
      class="foodbox_container"
      v-for="(item, index) in subItems"
      :class="{
        active_right_combo: activeOnClick.includes(
          item._id + selectedContainerId
        ),
      }"
      :key="index"
      @click="setActiveItems(item)"
    >
      <div class="food-item-box">
        <img :src="item.image" alt v-if="item.image != ''" />
        <img
          v-else
          :style="{
            background:
              item.image == '' && item.item_color ? item.item_color : 'white',
          }"
        />
        <div class="food-menu-item-text color-text">
          <label :title="dt(item)">
            {{ dt(item) }}
          </label>
        </div>
      </div>
      <div class="food-box-icon">
        <i
          class="fa fa-check item-selected-check right_icon"
          aria-hidden="true"
        ></i>
        <div
          class="button-plus"
          data-toggle="modal"
          data-target="#POSOrderItemOptions"
        >
          <div class="button-plus-icon" @click.stop="setModifiersForItem(item)">
            <svg
              class="color-text"
              viewBox="0 0 15 15"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.40002 6.3999V1.3999C8.40002 1.13469 8.29467 0.880332 8.10713 0.692796C7.9196 0.505259 7.66524 0.399902 7.40002 0.399902C7.13481 0.399902 6.88045 0.505259 6.69292 0.692796C6.50538 0.880332 6.40002 1.13469 6.40002 1.3999V6.3999H1.40002C1.13481 6.3999 0.880454 6.50526 0.692918 6.6928C0.505381 6.88033 0.400024 7.13469 0.400024 7.3999C0.400024 7.66512 0.505381 7.91947 0.692918 8.10701C0.880454 8.29455 1.13481 8.3999 1.40002 8.3999H6.40002V13.3999C6.40002 13.6651 6.50538 13.9195 6.69292 14.107C6.88045 14.2945 7.13481 14.3999 7.40002 14.3999C7.66524 14.3999 7.9196 14.2945 8.10713 14.107C8.29467 13.9195 8.40002 13.6651 8.40002 13.3999V8.3999H13.4C13.6652 8.3999 13.9196 8.29455 14.1071 8.10701C14.2947 7.91947 14.4 7.66512 14.4 7.3999C14.4 7.13469 14.2947 6.88033 14.1071 6.6928C13.9196 6.50526 13.6652 6.3999 13.4 6.3999H8.40002Z"
              />
            </svg>
          </div>
        </div>
      </div>
      <!--<div class="foodbox_price_cntr">
        &lt;!&ndash;<div class="food-menu-item-price">
          &lt;!&ndash;<strong>{{ formatPrice(item.value) }}</strong>&ndash;&gt;
        </div>&ndash;&gt;
      </div>-->
    </div>
  </div>
</template>

<script>
/* global $, showModal, hideModal */
/*   eslint-disable no-console */
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'ItemContent',
  data() {
    return {
      activeItems: {},
      activeOnClick: [],
    }
  },
  watch: {
    activeComboItems(newVal, oldVal) {
      if (newVal != oldVal) {
        this.$nextTick(() => {
          if (Object.keys(this.activeComboItems).length === 0) {
            this.activeOnClick = []
          }
          this.commitErrorMessage('')
        })
      }
    },
  },
  computed: {
    ...mapState('comboItems', [
      'subItems',
      'selectedItemContainer',
      'activeComboItems',
    ]),
    ...mapState('context', ['storeId']),
    ...mapGetters('location', ['formatPrice', '_t']),
    ...mapGetters('modifier', ['stateItemModifiers', 'modifiers']),
    ...mapGetters('auth', ['multistore']),
    ...mapGetters('comboItems', ['limitOfSelectingItems']),
    selectedContainerId() {
      return this.selectedItemContainer._id.$oid
    },
  },
  methods: {
    isActiveItem(itemId) {
      let activeItem = false
      let selectedContainerId = this.selectedContainerId
      if (typeof this.activeItems[selectedContainerId] != 'undefined') {
        this.activeItems[selectedContainerId].forEach(element => {
          if (element) {
            if (element._id === itemId) {
              if (!activeItem) activeItem = true
            }
          }
        })
      }
      return activeItem
    },
    ...mapActions('order', ['setActiveItem']),
    setActiveItems(item, modifiersBtn = false) {
      let selectedContainerId = this.selectedItemContainer._id.$oid
      if (Object.keys(this.activeComboItems).length === 0) {
        console.log(this.activeComboItems)
        this.activeItems = {}
        this.activeItems[selectedContainerId] = []
      }
      let itemIndex = false
      let selectedLength = 0
      if (typeof this.activeItems[selectedContainerId] != 'undefined') {
        itemIndex = this.activeItems[selectedContainerId].find(
          activatedItem => activatedItem._id === item._id
        )
        selectedLength = this.activeItems[selectedContainerId].length
      } else {
        this.activeItems[selectedContainerId] = []
      }

      if (itemIndex) {
        let indexSubItem = this.activeItems[selectedContainerId].indexOf(
          itemIndex
        )
        this.activeItems[selectedContainerId].splice(indexSubItem, 1)
        if (!modifiersBtn)
          this.activeOnClick.splice(
            this.activeOnClick.indexOf(item._id + selectedContainerId),
            1
          )
        this.commitErrorMessage('')
      } else {
        if (selectedLength != this.limitOfSelectingItems) {
          this.commitErrorMessage('')
          this.activeItems[selectedContainerId].push(item)
          this.activeOnClick.push(item._id + selectedContainerId)
          this.isActiveItem(item._id)
          if (this.$store.getters['modifier/hasModifiers'](item)) {
            /*$('#POSItemOptions .modifier-option-radio').prop('checked', false)
            this.$store.dispatch('modifier/assignModifiersToItem', item)
            this.$store.commit('orderForm/clearSelection')
            showModal('#POSItemOptions')*/
            this.setModifiersForItem(item, false)
          } else {
            hideModal('#POSItemOptions')
          }
        } else {
          this.commitErrorMessage(
            `You can select only ${this.limitOfSelectingItems} item (s)`
          )
        }
      }
      this.$store.commit('comboItems/ACTIVE_COMBO_ITEMS', this.activeItems, {
        root: true,
      })
    },
    setModifiersForItem(item, shouldCheckActiveItem = true) {
      if (shouldCheckActiveItem) this.setActiveItems(item, false)
      // if (this.$store.getters['modifier/hasModifiers'](item)) {
      this.$store.commit('modifier/SET_ITEM', item)
      $('#POSItemOptions .modifier-option-radio').prop('checked', false)
      // this.$store.dispatch('modifier/assignModifiersToItem', item)
      if (!this.stateItemModifiers.find(obj => obj.itemId == item._id)) {
        //use updated modifiers
        const modifiers = this.modifiers(item)

        this.$store.commit('modifier/SET_ITEM_MODIFIERS', {
          itemId: item._id,
          modifiers: modifiers,
          item: item,
          multistore: this.multistore ? this.storeId : false,
        })
      }
      showModal('#POSItemOptions')
      // }
    },
    commitErrorMessage(message) {
      this.$store.commit('comboItems/SET_ERROR_MESSAGE', message)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.modal-body {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 2rem;
  row-gap: 1rem;
  .food-menu-item {
    min-width: 95%;
    max-width: 95%;
    min-height: 12rem;
    max-height: 12rem;
    margin: auto;
    border: 2px solid #e3e7f2;
    padding: 0px 4px !important;

    .food-menu-item-img {
      margin: 0 auto;
      border-radius: $px3;
      width: 100%;
      max-height: $px130;
      margin-bottom: auto;
    }
    .food-menu-item-text {
      font-size: 1.1rem;
      text-align: center;
      word-break: break-word;
    }
    .food-menu-item-price {
      text-align: center;
      color: crimson;
      font-size: 0.9rem;
      font-weight: 600;
    }
  }
}
.foodbox_container {
  position: relative;
  cursor: pointer;
  border: solid;
  border-color: #5056ca5e;
  width: 100%;
  border-radius: 5px;
  min-height: 5.625rem !important;
  max-height: 5.625rem !important;
  // max-width: 11.063rem !important;
  @include responsive(mobile) {
    max-height: 100% !important;
    max-width: 100% !important;
  }
}
.food-item-box {
  display: grid;
  // grid-template-columns: 0.5fr 1.5fr auto;
  grid-template-columns: 0.5fr auto;
}
.food-item-box img {
  /*max-height: 2.188rem;
  min-height: 2.188rem;
  min-width: 2.188rem;
  max-width: 2.188rem;
  margin: 0.625rem;
  border-radius: 0.313rem;*/
  max-height: 2.688rem;
  min-height: 2.688rem;
  min-width: 2.688rem;
  max-width: 2.688rem;
  margin: 0.325rem;
  border-radius: 0.313rem;
}
.food-item-box > div {
  margin: 3.25rem 0.025rem 0px 0px;
}
i.fa.fa-check.item-selected-check {
  position: absolute;
  top: 0;
  right: 0;
  background: #5056ca;
  color: white;
  padding: 0.298rem;
  font-weight: 400;
  border-radius: 0.25rem;
  font-size: 1.125rem;
}
.addtocart-icon {
  text-align: center;
  cursor: pointer;
}
.addtocart-icon {
  font-size: 2.125rem;
  color: #5056ca;
}

.foodbox_price_cntr {
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 0px 0.313rem;
  align-items: center;
}
.foodbox_container:hover {
  box-shadow: #5056ca42 0px 0.063rem 0.75rem;
}
.modal-body.color-dashboard-background.grid_combo_item_content {
  overflow: hidden;
  padding: 1.563rem 1.625rem !important;
  padding-top: 0px !important;
  border-left: 1px solid #e3e7f2;
  /*min-height: 21.875rem;*/
  max-height: 21.875rem;
  overflow: hidden;
  overflow-y: auto;
}
.grid_parent_combo .food-box-icon {
  text-align: right;
  display: flex;
  justify-content: flex-end;
}
.button-plus {
  padding-right: 0.5rem;
}
.foodbox_container .item-selected-check.right_icon {
  display: none;
}

.foodbox_container.active_right_combo .item-selected-check.right_icon {
  display: block;
}
.food-menu-item-text.color-text {
  max-height: 2.188rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.063rem !important;
  word-break: normal;
  padding-right: 0.938rem;
  margin-top: 0.625rem;
}
.grid_combo_item_content::-webkit-scrollbar {
  display: none;
}
@media only screen and (max-width: 600px) and (min-width: 320px) {
  .grid_parent_combo {
    display: grid;
    grid-template-columns: 1fr;
  }
  .modal-body {
    display: grid;
    grid-template-columns: repeat(2, 2fr);
    grid-column-gap: 0.938rem;
    row-gap: 1rem;
  }
  .modal-body.color-dashboard-background.grid_combo_item_content {
    border-top: 1px solid #e3e7f2;
    min-height: 16.563rem !important;
    max-height: 16.563rem !important;
    height: 265px !important;
    overflow: hidden;
    overflow-y: auto;
  }
  .food-menu-item-text.color-text {
    font-size: 12px !important;
  }
}
</style>
