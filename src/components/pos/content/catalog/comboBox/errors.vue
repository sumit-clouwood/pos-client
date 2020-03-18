<template>
  <div>
    <p v-if="errorMessage" class="combobox_error_msg">
      You can select max three Items.
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorMessage: true,
    }
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
