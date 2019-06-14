<template>
  <div class="modal-footer" v-if="!loading">
    <div class="pagination-customer-details">
      <paginate
        v-if="paginateDetails.totalPages"
        :page-count="paginateDetails.totalPages"
        :page-range="1"
        :margin-pages="1"
        :clickHandler="moreCustomer"
        :prev-text="_t('Prev')"
        :next-text="_t('Next')"
        :container-class="''"
        :page-class="_t('page-item')"
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
        {{ _t('Cancel') }}
      </button>
      <button
        class="btn btn-success btn-large popup-btn-save"
        type="button"
        id="cust-new"
        @click="
          setDefaultSettingsGlobalAddUpdate({
            alternative_phone: '',
            gender: 'male',
          })
        "
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
import { mapState, mapActions, mapGetters } from 'vuex'
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
      customerDetails: state => state.customer.customer_list,
    }),
    ...mapState('customer', ['loading']),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    moreCustomer: function(pageNumber) {
      this.setPageNumber(pageNumber)
    },
    ...mapActions('customer', ['setPageNumber']),
    ...mapActions('customer', ['setDefaultSettingsGlobalAddUpdate']),
  },
}
</script>
