<template>
  <div>
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
  font-size: 18px;
  max-width: 600px;
  display: flex;
  flex-direction: row-reverse;
  margin: 0.5rem;
}
</style>
