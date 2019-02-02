<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Pos msg="Broccoli POS"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Pos from '@/components/Pos.vue'

export default {
  name: 'home',
  components: {
    Pos
  }
}
</script>
