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
