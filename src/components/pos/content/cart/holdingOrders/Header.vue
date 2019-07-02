<template>
  <div class="wrappers-new-orders">
    <div class="order">
      <h5>{{ _t("Holding") }} {{ _t("Orders") }}</h5>
      <p>{{ DateToday }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Header",
  props: {},
  // data: function() {
  //   return {
  //     today: DateTime.dateToday(),
  //   }
  // },
  computed: {
    ...mapGetters("location", ["_t"])
  }
};
</script>
