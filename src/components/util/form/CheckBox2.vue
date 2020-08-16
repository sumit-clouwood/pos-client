<template>
  <label class="checkbox-radio" :class="{ active: checked }">
    <div class="items">
      <slot></slot>
      <input
        class="checkbox2"
        type="checkbox"
        noaction="noaction"
        v-bind:checked="checked"
        v-on:change="emithis($event)"
      />
    </div>
  </label>
</template>
<script>
import { bus } from '@/eventBus'

export default {
  name: 'Checkbox',
  model: {
    prop: 'checked',
    event: 'change',
  },
  methods: {
    emithis(event) {
      if (this.noaction) {
        bus.$emit('checkbox2Change', {
          checked: event.target.checked,
          value: this.value,
          item: this.noaction,
        })
      } else {
        this.$emit('change', event.target.checked)
      }
    },
  },
  props: ['checked', 'value', 'noaction'],
}
</script>
