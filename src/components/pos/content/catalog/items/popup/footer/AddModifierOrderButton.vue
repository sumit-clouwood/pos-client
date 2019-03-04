<template>
  <button
    type="button"
    class="buttoned colorwhite donebutton"
    data-dismiss="modal"
    @click="addModifierOrder"
  >
    <img src="img/pos/done.png" alt="done" />
    <span>Done</span>
  </button>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'AddModifierOrderButton',
  props: {},
  methods: {
    ...mapActions('order', ['addModifierOrder']),
  },
}
</script>
