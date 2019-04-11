<template>
  <div class="row inner-container">
    <Header />
    <div class="table-hodler">
      <Tables />
    </div>
  </div>
</template>

<script>
import Header from './content/Header'
import Tables from './content/Tables'
export default {
  name: 'Content',
  props: {},
  components: {
    Header,
    Tables,
  },
}
</script>
<style scoped>
.inner-container {
  width: 100%;
}
</style>
