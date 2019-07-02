<template>
  <div v-if="modifiers">
    <div
      class="orders-button-small"
      v-for="modifierId in modifiers"
      :key="modifierId"
    >
      {{ findModifier(modifierId).name }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Modifiers",
  props: ["modifiers"],
  computed: {
    ...mapGetters("modifier", ["findModifier"])
  }
};
</script>
