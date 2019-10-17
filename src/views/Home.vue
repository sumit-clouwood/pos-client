<template>
  <div>
    <Location v-show="!loaded" msg="Broccoli POS" />
    <Pos v-show="loaded" msg="Broccoli POS" />
    <div v-if="getImages" class="payment-images">
      <link
        v-for="(url, key) in getImages"
        rel="prefetch"
        :href="url"
        :key="key"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
/* global $ */
import Pos from '@/components/Pos.vue'
import Location from '@/components/Location.vue'
import { mapState, mapGetters } from 'vuex'
// import BrandColor from '@/plugins/helpers/BrandColor'

export default {
  name: 'home',
  components: {
    Pos,
    Location,
  },
  computed: {
    ...mapState('sync', ['loaded']),
    ...mapState('location', ['brand']),
    ...mapGetters('payment', ['getImages']),
  },
  mounted() {
    let getBody = $('body')
    getBody.removeAttr('class')
    getBody.attr('class', 'fixed-nav sticky-footer')
    // BrandColor.applyDynamicRules(this.brand)
  },
}
</script>
