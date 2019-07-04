<template>
  <div class="btn-announce">
    <button
      type="button"
      class="buttoned colorwhite donebutton color-main"
      @click="addModifierOrder"
    >
      <img src="img/pos/done.png" alt="done" />
      <span class="color-text-invert">{{ _t("Apply") }}</span>
    </button>
  </div>
</template>
<script>
/* global closeModal */
import { mapGetters } from "vuex";
export default {
  name: "AddModifierOrderButton",
  props: {},
  computed: {
    ...mapGetters("location", ["_t"])
  },
  methods: {
    addModifierOrder() {
      this.$store
        .dispatch("order/addModifierOrder")
        .then(() => {
          closeModal("#POSItemOptions");
        })
        .catch();
    }
  }
};
</script>
