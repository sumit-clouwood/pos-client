<template>
  <div class="modal-body color-dashboard-background grid_combo_left">
    <div class="food-menu_container">
      <div class="food-menu_title">
        <p class="food_title">
          Pizza Selection
        </p>
        <i
          data-v-446e20ea=""
          aria-hidden="true"
          class="fa fa-check food-item-checked"
        ></i>
      </div>

      <div class="food-menu_title">
        <p class="food_title">
          Pasta Selection
        </p>
        <i
          data-v-446e20ea=""
          aria-hidden="true"
          class="fa fa-check food-item-checked"
        ></i>
      </div>

      <div class="food-menu_title">
        <p class="food_title">
          Cold Drink Section
        </p>
        <i
          data-v-446e20ea=""
          aria-hidden="true"
          class="fa fa-check food-item-checked"
        ></i>
      </div>

      <div class="food-menu_title">
        <p class="food_title">
          Pizza Selection
        </p>
        <i
          data-v-446e20ea=""
          aria-hidden="true"
          class="fa fa-check food-item-checked"
        ></i>
      </div>

      <div class="food-menu_title">
        <p class="food_title">
          Bread Selection
        </p>
        <i
          data-v-446e20ea=""
          aria-hidden="true"
          class="fa fa-check food-item-checked"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.modal-body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
.food-menu_container {
  display: grid;
  grid-template-rows: 1fr;
  grid-row-gap: 10px;
  position: relative;
}
.food-menu_title {
  position: relative;
  height: 65px;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  background-color: #afafaf;
  color: white;
  border-radius: 4px;
}
i.fa.fa-check.food-item-checked {
  position: absolute;
  right: 0px;
  top: 0px;
  color: white;
  background: #5056ca;
  padding: 3px;
  border-radius: 3px;
  font-weight: 300;
}
</style>
