<template>
  <form class="form-inline search-inline">
    <div class="inner-addon left-addon">
      <img class="search-img" src="img/pos/search-icon.png" alt="search" />
      <input
        type="text"
        class="form-control"
        placeholder="Search or scan for items"
        v-model="searchItems"
        @keydown="collectSearchItems(searchItems)"
      />
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Search',
  props: {},
  data() {
    return {
      searchItems: '',
    }
  },
  methods: {
    ...mapActions('category',['collectSearchItems'])
  }
}
</script>
