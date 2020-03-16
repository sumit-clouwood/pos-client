<template>
  <div class="modal-body color-dashboard-background">
    <div value="Chilli Garlic Shrimp" class="food-menu-item">
      <img
        class="food-menu-item-img"
        src="https://s3.amazonaws.com/broc-test/5d9f2254d355b82f1543bd82/menu/5e6a67b053b4b.png"
        alt="Chilli Garlic Shrimp"
      />
      <div class="food-menu-item-text color-text">
        Chilli Garlic Shrimp
      </div>
      <div class="food-menu-item-price">
        AED 70.35
      </div>
    </div>
    <div value="Chilli Garlic Shrimp" class="food-menu-item">
      <img
        src="https://s3.amazonaws.com/broc-test/5d9f2254d355b82f1543bd82/menu/5e6a67b053b4b.png"
        alt="Chilli Garlic Shrimp"
        class="food-menu-item-img"
      />
      <div class="food-menu-item-text color-text">
        Chilli Garlic Shrimp
      </div>
      <div class="food-menu-item-price">
        AED 70.35
      </div>
    </div>
    <div value="Chilli Garlic Shrimp" class="food-menu-item">
      <img
        src="https://s3.amazonaws.com/broc-test/5d9f2254d355b82f1543bd82/menu/5e6a67b053b4b.png"
        alt="Chilli Garlic Shrimp"
        class="food-menu-item-img"
      />
      <div class="food-menu-item-text color-text">
        Chilli Garlic Shrimp
      </div>
      <div class="food-menu-item-price">
        AED 70.35
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
</style>
