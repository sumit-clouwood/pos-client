<template>
  <span class="modifiers" v-if="modifiers.length">
    <a href="" v-for="modifierId in modifiers" :key="modifierId">{{
      findModifier(modifierId).name
    }}</a>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Modifiers',
  props: ['modifiers'],
  computed: {
    ...mapGetters('modifier', ['findModifier']),
  },
}
</script>

<style lang="scss" scoped>
.modifiers {
  a {
    font-size: 12px;
    border-radius: 4px;
    background-color: #ef7f2a;
    padding: 10px;
    color: #fff;
    font-family: 'Proxima Nova';
    margin-right: 10px;
    font-size: 10px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 15px;
    letter-spacing: normal;
    color: #ffffff;
    display: inline-block;
    margin-bottom: 5px;
  }
}
</style>
