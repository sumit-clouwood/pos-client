<template>
  <div class="modal-footer">
    <div class="pagination-customer-details">
      <paginate
        v-if="paginateDetails.totalPages"
        :page-count="paginateDetails.totalPages"
        :page-range="1"
        :margin-pages="1"
        :clickHandler="setPageNumber"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="''"
        :page-class="'page-item'"
      >
      </paginate>
      <!--</template>-->
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
import paginate from 'vuejs-paginate'

export default {
  name: 'ManageCustomerFooter',
  props: {},
  components: {
    paginate,
  },
  computed: {
    ...mapState({
      paginateDetails: state => state.customer.paginate,
    }),

  },
  methods: {
    ...mapActions('customer', ['setPageNumber']),
  },
}
</script>
