<template>
  <div class="header-main-left">
    <HeaderOrderType />
    <div class="header-main-left-time">
      <a href="javascript:void(0)">
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
