<template>
  <!-- Manage Customers -->
  <div class="modal fade" id="manage-customer" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Manage Customers') }}
          </h4>
        </div>
        <div class="modal-body manage-customer-wrap color-dashboard-background">
          <div class="cust-top-arrow food-arrow" @click="customerTop">
            <i class="fa fa-chevron-up" aria-hidden="true"></i>
          </div>
          <div class="cust-bottom-arrow food-arrow" @click="customerBottom">
            <i class="fa fa-chevron-down" aria-hidden="true"></i>
          </div>
          <ManageCustomerHeader />
          <ManageCustomerContent />
        </div>
        <ManageCustomerFooter />
      </div>
    </div>
  </div>
  <!-- End Manage Customers -->
</template>

<script>
/* global $ */
import ManageCustomerHeader from './ManageCustomer/ManageCustomerHeader'
import ManageCustomerContent from './ManageCustomer/ManageCustomerContent'
import ManageCustomerFooter from './ManageCustomer/ManageCustomerFooter'
import { mapGetters } from 'vuex'

export default {
  name: 'ManageCustomer',
  props: {},
  computed: {
    ...mapGetters('location', ['_t']),
  },
  components: {
    ManageCustomerHeader,
    ManageCustomerContent,
    ManageCustomerFooter,
  },
  data() {
    return {
      custBlockHeight: 0,
      custBlockInitHeight: 0,
      custBlockItemHeight: 0,
    }
  },
  updated() {
    this.custAreaCalculation()
  },
  methods: {
    custAreaCalculation() {
      let custBlockHeight = $('.manage-customer-table').innerHeight()
      this.custBlockHeight = custBlockHeight
      this.custBlockInitHeight = custBlockHeight
      this.custBlockItemHeight = $('.manage-customer-table > div').innerHeight()
      $('.cust-bottom-arrow, .cust-top-arrow').removeClass('disable')
      if (this.custBlockHeight > this.custBlockItemHeight) {
        $('.cust-bottom-arrow, .cust-top-arrow').addClass('disable')
      }
    },
    customerTop() {
      if (this.custBlockItemHeight === 0) this.custAreaCalculation()
      if (this.custBlockHeight <= 0) {
        $('.cust-top-arrow').addClass('disable')
        return false
      }
      this.custBlockHeight -= parseInt(this.custBlockInitHeight)
      $('.cust-bottom-arrow').removeClass('disable')
      $('.manage-customer-table').animate(
        { scrollTop: this.custBlockHeight },
        1000
      )
    },
    customerBottom() {
      if (this.custBlockItemHeight === 0) this.custAreaCalculation()
      this.custBlockHeight += parseInt(this.custBlockInitHeight)
      if (this.custBlockHeight >= this.custBlockItemHeight) {
        this.custBlockHeight -= parseInt(this.custBlockInitHeight)
        $('.cust-bottom-arrow').addClass('disable')
        return false
      }
      $('.cust-top-arrow').removeClass('disable')
      $('.manage-customer-table').animate(
        { scrollTop: this.custBlockHeight },
        1000
      )
    },
  },
}
</script>
<style lang="scss">
@import '../../../../assets/scss/pixels_rem.scss';
@import '../../../../assets/scss/variables.scss';
@import '../../../../assets/scss/mixins.scss';

#manage-customer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;

  .modal-dialog {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100vh;

    .search-field {
      border: 1px solid $gray-middle;
      display: grid;
      grid-template-columns: 50px 1fr;
      padding: 5px 0;
      border-radius: 3px;

      input {
        height: 40px;
      }
    }
  }
}
</style>
