<template>
  <div class="header color-text-invert color-dashboard-background">
    <div class="header-main">
      <TopNavLeft />
      <TopNavRight />
    </div>
  </div>
</template>

<script>
import TopNavLeft from "./header/TopNavLeft";
import TopNavRight from "./header/TopNavRight";

export default {
  name: "Header",
  props: {},
  components: {
    TopNavLeft,
    TopNavRight
  }
};
</script>
