<template>
  <div class="inner-addon left-addon">
    <img class="search-img" src="img/pos/search-icon.png" alt="search" />
    <input
      type="text"
      class="form-control"
      placeholder="Search customer"
      v-model="searchTerms"
      @keypress.enter="searchCustomer(searchTerms)"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ManageCustomerHeader',
  data: function() {
    return {
      searchTerms: '',
    }
  },
  // computed: {
  //   ...mapState({
  //     searchTerms: state => state.customer.params.search,
  //   }),
  // },
  methods: {
    ...mapActions('customer', ['searchCustomer']),
  },
}
</script>
