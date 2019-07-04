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
import BrandColor from "@/plugins/helpers/BrandColor";

export default {
  name: "home",
  components: {
    Pos,
    Location
  },
  computed: {
    ...mapState("sync", ["loaded"]),
    ...mapState("location", ["brand"])
  },
  mounted() {
    let getBody = $("body");
    getBody.removeAttr("class");
    getBody.attr("class", "fixed-nav sticky-footer");
    // BrandColor.applyColoring(this.brand);
    // let a = [{".active":["backgroud", "red"]}];
    // eslint-disable-next-line no-console
    console.log(this.brand);
    let a = [
      [".color-button", ["background-color", this.brand["color-button"], true]],
      [
        ".color-dashboard-background",
        ["background-color", this.brand["color-dashboard-background"], true]
      ],
      [
        ".color-icon-table-neutral-button",
        [
          "background-color",
          this.brand["color-icon-table-neutral-button"],
          true
        ]
      ],
      [
        ".pagination-customer-details li",
        ["background-color", this.brand["color-secondary"], true]
      ],
      [".color-main", ["background-color", this.brand["color-main"], true]],
      [".active", ["background-color", this.brand["color-main"], true]],
      [".slick-active", ["background-color", this.brand["color-main"], true]],
      [
        ".color-secondary",
        ["background-color", this.brand["color-secondary"], true]
      ],
      [".color-shadow", ["background-color", this.brand["color-shadow"], true]],
      [
        ".color-tables-background",
        ["background-color", this.brand["color-tables-background"], true]
      ],
      [".color-text", ["color", this.brand["color-text"], true]],
      [".color-text-invert", ["color", this.brand["color-text-invert"], true]],
      [".color-warning", ["color", this.brand["color-warning"], true]]
    ];
    BrandColor.addStylesheetRules(a);
  }
};
</script>
