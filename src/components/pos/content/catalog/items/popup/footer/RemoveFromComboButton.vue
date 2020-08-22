<template>
  <button type="button" class="btn btn-danger" @click="removeFromCombo">
    <span class="color-text-invert">{{ _t('Remove from Combo') }}</span>
  </button>
</template>
<script>
import { bus } from '@/eventBus'
import { mapGetters } from 'vuex'
export default {
  name: 'RemoveFromComboButton',
  props: {},
  computed: {
    ...mapGetters('location', ['_t']),
  },
  methods: {
    removeFromCombo() {
      bus.$emit('removeComboItemWithModifiers')
    },
  },
}
</script>
