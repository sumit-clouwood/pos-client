<template>
  <div>
    <p></p>
    <p v-show="errorMessage" class="combobox_error_msg">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('comboItems', ['errorMessage']),
  },
}
</script>

<style lang="scss" scoped>
.combobox_error_msg {
  color: #cc3232;
  font-size: 1.125rem;
  width: 37.406rem;
  margin: 0 auto;
  margin-right: 0;
  max-width: 100% !important;
  text-align: left;
  display: block;
  padding-left: 0.625rem;
}
@media only screen and (max-width: 600px) and (min-width: 320px) {
  .combobox_error_msg {
    text-align: center !important;
    padding: 0 !important;
  }
}
</style>
