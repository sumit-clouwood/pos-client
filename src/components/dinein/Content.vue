<template>
  <div class="left-container">
    <Header />
    <div class="table-holder" v-if="tablesOnArea">
      <TableDraw />
    </div>
  </div>
</template>

<script>
import Header from './content/Header'
import TableDraw from './content/TableDraw'
import { mapState } from 'vuex'
export default {
  name: 'Content',
  props: {},
  computed: {
    ...mapState('dinein', ['tablesOnArea'])
  },
  components: {
    Header,
    TableDraw,
  },
}
</script>
<style scoped>
.inner-container {
  width: 100%;
}
</style>
