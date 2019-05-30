<template>
  <form class="form-inline search-inline">
    <div class="inner-addon left-addon">
      <img class="search-img" src="img/pos/search-icon.png" alt="search" />
      <input
        type="text"
        class="form-control"
        :placeholder="_t('Start typing to get search results')"
        v-model="searchItems"
        @keyup="collectSearchItems(searchItems)"
      />
    </div>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Search',
  props: {},
  data() {
    return {
      searchItems: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
  methods: {
    ...mapActions('category', ['collectSearchItems']),
  },
}
</script>
