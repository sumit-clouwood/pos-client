<template>
  <div class="search-field color-dashboard-background">
    <label class="search-field-icon">
      <i class="fa fa-search" aria-hidden="true"></i>
    </label>
    <form>
      <input
        type="text"
        class="search-field-input"
        :placeholder="_t('Search') + ' ' + _t('customer')"
        v-model="searchTerms"
        @keyup="searchCustomer()"
        @keypress="$event.keyCode == 13 ? $event.preventDefault() : true"
      />
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ManageCustomerHeader',
  data: function() {
    return {
      inputTimer: null,
      searchTerms: '',
    }
  },
  methods: {
    searchCustomer() {
      clearTimeout(this.inputTimer)
      // if (this.searchTerms.length > 0) {
      this.inputTimer = setTimeout(() => {
        this.loading = true
        this.$store
          .dispatch('customer/searchCustomer', this.searchTerms)
          .then(() => {})
      }, 500) //waith half second until user finishes the typing
      // }
    },
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>
