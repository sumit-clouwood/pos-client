<template>
  <div class="modal-footer" v-if="!loading">
    <div class="pagination-customer-details">
      <paginate
        :page-count="paginateDetails"
        :page-range="2"
        :margin-pages="2"
        :clickHandler="moreCustomer"
        :prev-text="_t('Prev')"
        :next-text="_t('Next')"
        :container-class="''"
        :page-class="_t('page-item')"
        v-model="page"
      >
      </paginate>
      <!--</template>-->
    </div>
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-danger cancel-announce color-button color-text-invert"
        data-dismiss="modal"
      >
        {{ _t('Cancel') }}
      </button>
      <button
        class="btn btn-success btn-large popup-btn-save color-main color-text-invert"
        type="button"
        id="cust-new"
        @click="addCustomerForm"
        data-toggle="modal"
        data-target="#customer"
        data-dismiss="modal"
      >
        {{ _t('Create New Customer') }}
      </button>
    </div>
    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
  </div>
</template>

<script>
/*global $*/
import { mapState, mapActions, mapGetters } from 'vuex'
import paginate from 'vuejs-paginate'
export default {
  name: 'ManageCustomerFooter',
  props: {},
  components: {
    paginate,
  },
  data() {
    return {
      page: 1,
    }
  },
  computed: {
    ...mapState({
      paginateDetails: state => state.customer.paginate,
      customerDetails: state => state.customer.customer_list,
    }),
    ...mapState('customer', ['loading']),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    moreCustomer: function(pageNumber) {
      this.setPageNumber(pageNumber)
    },
    addCustomerForm: function() {
      this.addCustomer()
      $('#post_announcement').attr('disabled', false) //Disable Save button if pressed
      $('#customer input, #customer select').val('')
      $('.nogeneral').show()
      $('.customerAddressWrapper').show()
    },
    ...mapActions('customer', ['setPageNumber', 'addCustomer']),
  },
}
</script>
