<template>
  <div class="error_mgs_container">
    <div></div>
    <div v-show="errorMessage" class="combobox_error_msg">
      {{ errorMessage }}
    </div>
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
.combobox_error_msg[data-v-732f2b94] {
  color: #cc3232;
  font-size: 1.125rem;
  margin-right: 0;
  padding-left: 0.625rem;
}

.error_mgs_container {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
@media only screen and (max-width: 600px) and (min-width: 320px) {
  .combobox_error_msg {
    text-align: center !important;
    padding: 0 !important;
  }
}
</style>
