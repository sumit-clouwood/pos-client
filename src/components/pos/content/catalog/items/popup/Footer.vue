<template>
  <div class="modal-footer color-dashboard-background">
    <p class="text-danger" v-if="errorMessage">{{ errorMessage }}</p>
    <AddModifierOrderButton @error="error" />
  </div>
</template>

<script>
//this footer ll be always called by the catalog and modifiers items only
import AddModifierOrderButton from './footer/AddModifierOrderButton'
export default {
  name: 'Footer',
  props: {},
  data() {
    return {
      errorMessage: false,
    }
  },
  components: {
    AddModifierOrderButton,
  },
  methods: {
    error(errorMessage) {
      this.errorMessage = errorMessage
    },
  },
  mounted() {
    setTimeout(() => {
      this.errorMessage = false
    }, 3000)
  },
}
</script>
