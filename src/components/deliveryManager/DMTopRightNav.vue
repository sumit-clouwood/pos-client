<template>
  <div class="wrap-hambtn">
    <div id="ham-btn">
      <button data-toggle="modal" data-target="#bar-sign" class="hamburger">
        &#9776;
      </button>
      <button class="cross">&#735;</button>
    </div>
    <div class="dm-walk-dine">
      <button id="dm-walkin">
        <span><img src="img/other/dinein-img.png"/></span>Walk-In
      </button>
      <button id="dm-dinein">
        <span><img src="img/other/walkin.png"/></span>Dine-In
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DMTopRightNav',
}
</script>

<style scoped></style>
