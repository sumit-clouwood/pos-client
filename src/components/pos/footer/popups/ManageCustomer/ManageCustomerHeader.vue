<template>
  <div class="inner-addon left-addon">
    <img class="search-img" src="img/pos/search-icon.png" alt="search" />
    <input
      type="text"
      class="form-control"
      placeholder="Search customer"
      v-model="searchTerms"
      @keyup="searchCustomer(searchTerms)"
    />
  </div>
</template>

<script>
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
      if (this.searchTerms.length > 0) {
        this.inputTimer = setTimeout(() => {
          this.loading = true
          this.$store
            .dispatch('customer/searchCustomer', this.searchTerms)
            .then(() => {})
        }, 500) //waith half second until user finishes the typing
      }
    },
  },
}
</script>
