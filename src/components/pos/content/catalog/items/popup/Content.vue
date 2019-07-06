<template>
  <div
    class="modal-body color-dashboard-background"
    v-if="itemModifiers(item._id)"
  >
    <Modifiers
      v-for="subgroup in itemModifiers(item._id)"
      :subgroup="subgroup"
      :key="subgroup._id"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Modifiers from './content/Modifiers'
export default {
  name: 'Content',
  props: {},
  components: {
    Modifiers,
  },
  computed: {
    ...mapState('modifier', ['item']),
    ...mapGetters('modifier', ['itemModifiers']),
  },
}
</script>

<style scoped>
.error {
  color: #ff0000;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e3e7f2;
}
</style>
