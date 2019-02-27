<template>
  <div class="modal-body">
    <Modifiers v-if="itemModifiers" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Modifiers from './content/Modifiers'
export default {
  name: 'Content',
  props: {},
  components: {
    Modifiers,
  },
  computed: {
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
