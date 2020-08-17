<template>
  <label class="checkbox-radio" :class="{ active: checked }">
    <div class="items">
      <slot></slot>
      <input
        class="checkbox2"
        type="checkbox"
        noaction="noaction"
        v-bind:checked="checked"
        v-on:change="
          noaction
            ? $emit('change', false)
            : $emit('change', $event.target.checked)
        "
      />
    </div>
  </label>
</template>
<script>
export default {
  name: 'Checkbox',
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: Boolean,
    value: String,
    noaction: Boolean,
  },
}
</script>
