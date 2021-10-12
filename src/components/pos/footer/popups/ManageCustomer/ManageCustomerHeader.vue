<template>
  <div class="search-field color-dashboard-background">
    <label class="search-field-icon">
      <i class="fa fa-search" aria-hidden="true"></i>
    </label>
    <form>
      <input
        type="text"
        class="search-field-input"
        id="searchCustomerTerm"
        :placeholder="_t('Search') + ' ' + _t('customer')"
        @keyup="searchCustomer"
      />
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { debounce } from '@/util.js'
export default {
  name: 'ManageCustomerHeader',
  data: function() {
    return {
      inputTimer: null,
      // searchTerms: '',
    }
  },
  methods: {},
  computed: {
    ...mapGetters('location', ['_t']),
    // ...mapState({
    //   searchTerm: state => state.customer.params.query,
    // }),
  },
  created() {
    this.searchCustomer = debounce(
      function(event) {
        this.$store
          .dispatch('customer/searchCustomer', event.target.value)
          .then(() => {})
      }.bind(this),
      500
    )
  },
}
</script>
