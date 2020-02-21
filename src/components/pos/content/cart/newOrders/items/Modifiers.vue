<template>
  <div v-if="modifiers">
    <div
      class="orders-button-small"
      v-for="modifierId in modifiers"
      :key="modifierId"
    >
      {{ dt(findModifier(modifierId, item)) }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Modifiers',
  props: ['modifiers', 'item'],
  computed: {
    ...mapGetters('modifier', ['findModifier']),
  },
}
</script>
