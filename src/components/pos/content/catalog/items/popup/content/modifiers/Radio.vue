<template>
  <label class="container-radio-btn">
    <span class="customradioc-block">
      <input
        type="radio"
        class="customradio"
        :name="data.groupId"
        :value="value"
        v-model="radios"
      />
      <span class="checkmark-radio-btn"></span>
    </span>
    <img :src="data.image" alt="" />
    <span>{{ data.name }}</span>
    <div v-if="data.price">({{ data.price }})</div>
  </label>
</template>

<script>
export default {
  name: 'Radio',
  model: {
    prop: 'checked',
  },
  props: {
    data: Object,
    checked: Object,
    value: Object,
  },
  computed: {
    radios: {
      get() {
        return this.checked
      },
      set() {
        //emit to parent, event type : input, value this.value
        this.$emit('input', this.value)
      },
    },
  },
  methods: {},
  mounted() {},
}
</script>
