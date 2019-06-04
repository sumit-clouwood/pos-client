<template>
  <div class="search-field">
    <div class="search-field-icon">
      <!--<img class="search-field-img" src="images/search-icon.png" alt="search">-->
      <i class="fa fa-search" aria-hidden="true"></i>
    </div>
    <input
      type="text"
      class="search-field-input"
      :placeholder="_t('Start typing to get search results')"
      v-model="searchItems"
      @keyup="collectSearchItems(searchItems)"
    />
  </div>
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
