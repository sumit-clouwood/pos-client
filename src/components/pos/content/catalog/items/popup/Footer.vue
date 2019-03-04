<template>
  <div class="modal-footer">
    <AddModifierOrderButton />
  </div>
</template>

<script>
//this footer ll be always called by the catalog and modifiers items only
import AddModifierOrderButton from './footer/AddModifierOrderButton'
export default {
  name: 'Footer',
  props: {},
  components: {
    AddModifierOrderButton,
  },
}
</script>
