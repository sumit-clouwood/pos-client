<template functional>
  <div v-if="props.item.combo_items">
    <div
      class="orders-button-small"
      v-for="comboItem in props.item.combo_items"
      :key="comboItem"
    >
      {{ dt(comboItem) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modifiers',
  props: ['item'],
}
</script>
