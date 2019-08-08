<template>
  <div class="floor-section-wrap">
    <div class="floor-section">
      <!--<ul class="ullist-floor" v-if="loading">
        <li><a role="button" class="cursor-pointer">{{ _t('loading') }}</a></li>
      </ul>-->
      <ul class="ullist-floor" v-if="areas">
        <li
          :class="{
            active: activeArea._id === area._id,
            'color-dashboard-background': true,
          }"
          v-for="(area, index) in areas"
          :key="index"
          @click="selectedArea(area)"
        >
          <a role="button" class="cursor-pointer">{{ area.name }}</a>
        </li>
      </ul>
      <ul class="ullist-floor" v-else>
        <li><a role="button" class="cursor-pointer">{{ _t('No area added for this store') }}</a></li>
      </ul>
    </div>
    <div class="search-dine-table">
      <form class="form-inline search-inline">
        <div class="inner-addon left-addon">
          <img class="search-img" src="img/pos/search-icon.png" alt="search" />
          <input type="text" class="form-control" placeholder="Search table" />
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'Header',
  computed: {
    ...mapState('dinein', ['areas', 'activeArea', 'loading']),
    ...mapGetters('location', ['_t'])
  },
  methods: {
    ...mapActions('dinein', ['selectedArea'])
  }
}
</script>
