<template>
  <div class="search-field color-text-invert color-dashboard-background">
    <div class="search-field-icon ">
      <!--<img class="search-field-img" src="images/search-icon.png" alt="search">-->
      <i class="fa fa-search color-text-invert" aria-hidden="true"></i>
    </div>
    <input
      type="search"
      class="search-field-input color-dashboard-background"
      :placeholder="_t('Start typing to get search results')"
      v-model="searchItems"
      @keyup="collectSearchItems(searchItems)"
    />
  </div>
</template>

<script>
/* global $ */
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
  mounted() {
    this.searchItems = ''
    setTimeout(function() {
      $('.search-field-input').val('')
    }, 1500)
  },
  methods: {
    ...mapActions('category', ['collectSearchItems']),
  },
}
</script>
