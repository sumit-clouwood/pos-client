<template>
  <div class="inner-addon left-addon">
    <img class="search-img" src="img/pos/search-icon.png" alt="search" />
    <input type="text" class="form-control" placeholder="Search customer" @keypress="searchCustomer"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ManageCustomerHeader',
  props: {},
  methods: {
    ...mapActions('customer', ['searchCustomer']),
  }
}
</script>
