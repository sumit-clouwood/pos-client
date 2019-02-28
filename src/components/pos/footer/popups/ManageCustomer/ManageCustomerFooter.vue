<template>
  <div class="modal-footer">
    <div class="pagination-customer-details">
      <ul class="ullist-pagination">
        <li class="next-page" id="previous-page">
          <img src="img/pos/back-arrow.png" alt="next-btn" />
        </li>
        <!--v-if="pageNumber === paginateDetails.currentPage" add class active-->
        <li
          class="customer-paginate-page-number"
          :class="{ active: pageNumber === statePageNumber }"
          v-for="pageNumber in paginateDetails.totalPages | limit 5"
          :key="pageNumber"
          v-on:click="setPageNumber(pageNumber)"
        >
          {{ pageNumber }}
        </li>
        <li class="next-page" id="next-page">
          <img src="img/pos/next-arrow.png" alt="next-btn" />
        </li>
        <li>Last</li>
      </ul>
    </div>
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-danger cancel-announce"
        data-dismiss="modal"
      >
        <span>X</span>Cancel
      </button>
      <button
        class="btn btn-success btn-large popup-btn-save"
        type="button"
        id="cust-new"
        data-toggle="modal"
        data-target="#customer"
        data-dismiss="modal"
      >
        New Customer
      </button>
    </div>
    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ManageCustomerFooter',
  props: {},
  computed: {
    ...mapState({
      paginateDetails: state => state.customer.paginate,
    }),
    ...mapState({
      statePageNumber: state => state.customer.params.page_number,
    }),
  },
  methods: {
    // updatePageNumber: function () {
    //   this.$store.dispatch('customer/fetchCustomers', data)
    // },
    ...mapActions('customer', ['setPageNumber']),
  },
}
</script>
