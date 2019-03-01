<template>
  <div class="modal-body order-modal-body">
    <Modifiers v-if="item && item.modifiable" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Modifiers from '@/components/pos/content/catalog/items/popup/content/Modifiers.vue'
export default {
  name: 'Content',
  props: {},
  components: {
    Modifiers,
  },
  computed: {
    ...mapState('order', ['item']),
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
