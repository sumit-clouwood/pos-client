<template>
  <div class="header-main-left color-dashboard-background">
    <HeaderOrderType />
    <div class="header-main-left-time color-main color-text-invert">
      <a href="javascript:void(0)" class="color-text-invert">
        <span class="time">{{ todayTime }}</span>
        <span>{{ todayDate }}</span></a
      >
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import moment from "moment-timezone";
import HeaderOrderType from "./HeaderOrderType";

export default {
  name: "NavSidebar",
  props: {},
  components: {
    HeaderOrderType
  },
  data() {
    return {
      todayDate: moment().format("MMMM Do YYYY"),
      todayTime: moment().format("h:mm:ss a")
    };
  },
  mounted: function() {
    setInterval(() => {
      this.todayTime = moment().format("h:mm:ss a");
    }, 1000);
  }
};
</script>
