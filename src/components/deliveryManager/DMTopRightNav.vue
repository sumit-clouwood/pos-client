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
        <router-link to="/" class="text-white"
          ><span><img src="/pos/img/other/dinein-img.png"/></span>
          Walk-In</router-link
        >
      </button>
      <button id="dm-dinein">
        <router-link to="/" class="text-white"
          ><span><img src="/pos/img/other/walkin.png"/></span>
          Dine-In</router-link
        >
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
