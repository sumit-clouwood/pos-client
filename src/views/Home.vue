<template>
  <div>
    <Location v-show="!loaded" msg="Broccoli POS" />
    <Pos v-show="loaded" msg="Broccoli POS" />
  </div>
</template>

<script>
// @ is an alias to /src
/* global $ */
import Pos from "@/components/Pos.vue";
import Location from "@/components/Location.vue";
import { mapState } from "vuex";

export default {
  name: "home",
  components: {
    Pos,
    Location
  },
  computed: {
    ...mapState("sync", ["loaded"])
  },
  mounted() {
    let getBody = $("body");
    getBody.removeAttr("class");
    getBody.attr("class", "fixed-nav sticky-footer");
  }
};
</script>
