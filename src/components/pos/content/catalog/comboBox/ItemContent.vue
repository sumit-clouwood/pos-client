<template>
  <div class="modal-body color-dashboard-background grid_combo_item_content">
    <!--<div
      value="Chilli Garlic Shrimp"
      class="foodbox_container active_right_combo"
    >
      <i
        class="fa fa-check item-selected-check right_icon"
        aria-hidden="true"
      ></i>
      <div class="food-item-box">
        <img
          src="https://s3.amazonaws.com/broc-test/5d9f2254d355b82f1543bd82/menu/5e6a67b053b4b.png"
          alt="Chilli Garlic Shrimp"
          class="food-menu-item-img"
        />
        <div class="food-menu-item-text color-text">
          Chilli Garlic Shrimp
        </div>
      </div>
      <div class="foodbox_price_cntr">
        <div class="food-menu-item-price">
          AED 70.35 AED 60.55
        </div>
        <div class="food-box-icon">
          <i class="fa fa-plus-circle addtocart-icon" aria-hidden="true"></i>
        </div>
      </div>
    </div>-->

    <div
      class="foodbox_container"
      :class="{ active_right_combo: activeItems.includes(index) }"
      v-for="(item, index) in subItems"
      :key="index"
      @click="setActiveItems(index)"
    >
      <div class="food-item-box">
        <img :src="item.image" alt v-if="item.image != ''" />
        <img
          v-else
          :style="{
            background: item.image == '' ? item.item_color : '',
          }"
        />
        <div class="food-menu-item-text color-text">
          {{ dt(item) }}
        </div>
      </div>
      <div class="foodbox_price_cntr">
        <div class="food-menu-item-price">
          {{ formatPrice(item.value) }}
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
            <div
              class="button-plus-icon"
              @click="setActiveItem({ orderItem: item, index: index })"
            >
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
            <!--<img-->
            <!--src="img/pos/plus-icon.png"-->
            <!--alt="plus"-->
            <!--@click="setActiveItem({ orderItem: item, index: index })"-->
            <!--/>-->
          </div>
          <!--<i class="fa fa-plus-circle addtocart-icon" aria-hidden="true"></i>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'ItemContent',
  data() {
    return {
      activeItems: [],
    }
  },
  computed: {
    ...mapState('comboItems', ['subItems']),
    ...mapGetters('location', ['formatPrice', '_t']),
  },
  methods: {
    ...mapActions('order', ['setActiveItem']),
    setActiveItems(index) {
      this.activeItems.push(index)
      // eslint-disable-next-line no-console
      console.log(this.activeItems)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.modal-body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 15px;
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
  border: solid;
  border-color: #5056ca5e;
  width: 100%;
  border-radius: 5px;
}
.food-item-box {
  display: grid;
  grid-template-columns: 0.5fr 1.5fr;
}
.food-item-box img {
  max-height: 35px;
  margin: 10px;
  border-radius: 5px;
}
.food-item-box > div {
  margin: 4px 0 0px 0px;
}
i.fa.fa-check.item-selected-check {
  position: absolute;
  top: 0;
  right: 0;
  background: #5056ca;
  color: white;
  padding: 3px;
  font-weight: 300;
  border-radius: 4px;
  font-size: 12px;
}
.addtocart-icon {
  text-align: center;
  cursor: pointer;
}
.addtocart-icon {
  font-size: 34px;
  color: #5056ca;
}

.foodbox_price_cntr {
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 0px 5px;
  align-items: center;
}
.foodbox_container:hover {
  box-shadow: #5056ca42 0px 1px 12px;
}
.modal-body.color-dashboard-background.grid_combo_item_content {
  max-height: 590px;
  overflow: hidden;
  overflow-y: auto;
  padding: 25px 10px !important;
}
.grid_parent_combo .food-box-icon {
  text-align: right;
}

.foodbox_container .item-selected-check.right_icon {
  display: none;
}

.foodbox_container.active_right_combo .item-selected-check.right_icon {
  display: block;
}
</style>
