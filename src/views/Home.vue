<template>
  <div class="home">
    <Location v-show="!location" msg="Broccoli POS" />
    <Pos v-show="location" msg="Broccoli POS" />
  </div>
</template>

<script>
// @ is an alias to /src
import Pos from '@/components/Pos.vue'
import Location from '@/components/Location.vue'
import { mapState } from 'vuex'

export default {
  name: 'home',
  components: {
    Pos,
    Location,
  },
  computed: {
    ...mapState('location', ['location']),
  },
}
</script>
