<template>
  <!-- Add Note -->
  <div class="modal fade" id="search-loyalty-customer" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Loyalty') }}
          </h4>
        </div>
        <form class="modal-body add-note-wrap" autocomplete="off">
          <p class="color-text-invert">{{ _t('Jump to customer') }}</p>
          <div class="add-note-area <!--loyalty-search-->">
            <input
              autocomplete="off"
              type="text"
              :placeholder="_t('Search')"
              class="inputSearch"
              id="getCustomerList"
              v-model="searchTerm"
              v-on:keyup="search()"
              @keypress="$event.keyCode == 13 ? $event.preventDefault() : true"
            />
            <!--<button
              type="button"
              class="btn btnSuccess color-main color-text-invert"
              id="load"
              v-on:click="search()"
            >
              <span
                class="spinner-border spinner-border-sm color-main color-text-invert"
                role="status"
                aria-hidden="true"
                ><i
                  class="fa fa-circle-o-notch fa-spin"
                  id="searchLoader"
                  v-if="searchTerm.length"
                ></i>
                {{ _t('Search') }}</span
              >
            </button>-->
          </div>
          <span
            class="loyalty-error text-danger loyalty-customer-error color-warning"
          >
            {{ _t(searchCustomerErr) }}
          </span>
          <div class="dropdown" v-if="customers.length && searchTerm.length">
            <div id="myDropdown" class="dropdown-content">
              <span
                class="showItem color-dashboard-background"
                v-for="customer in customers"
                :key="customer.customerId"
                v-on:click="selectCustomer(customer)"
              >
                {{ customer.name }}
                <span
                  class="pull-right p-0"
                  :class="customer.active ? 'text-success' : 'text-danger'"
                >
                  {{ customer.active ? 'Activated' : 'Deactivated' }}
                </span>
              </span>
            </div>
            <!--            <small>{{searchTerm}}</small>-->
          </div>
        </form>
        <div class="modal-footer">
          <div
            data-toggle="modal"
            data-dismiss="modal"
            class="cursor-pointer blue-middle color-text-invert"
            @click="loyaltyAddCustomer('#customer')"
          >
            {{ _t('Create New Customer') }}
          </div>
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce color-text-invert color-button"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
            <button
              @click="addLoyalty"
              class="btn btn-success btn-large color-text-invert color-main"
              type="button"
              id="save-note"
            >
              {{ _t('Select') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>

  <!-- Add note -->
  <!-- ====================================== -->
</template>

<script>
/* global $ */
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'SearchLoyaltyCustomer',
  props: {},
  data() {
    return {
      searchTerm: '',
      customerId: '',
      inputTimer: '',
      searchCustomerErr: '',
    }
  },
  computed: {
    ...mapState({
      customers: state => state.customer.customer_list,
    }),
    ...mapState('loyalty', ['loyalty']),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    loyaltyAddCustomer: function(target) {
      this.$store.commit('loyalty/LOYALTY', true)
      this.addCustomer()
      $('#post_announcement').attr('disabled', false) //Disable Save button if pressed
      $('#customer input, #customer select').val('')
      $(target).modal('show')
      $('.nogeneral').hide()
    },

    addLoyalty: function() {
      if (this.customerId.length > 0) {
        this.searchCustomerErr = ''
        $('.text-danger').hide()
        $('#search-loyalty-customer').modal('toggle')
        this.fetchSelectedCustomer(this.customerId)
      } else {
        this.searchCustomerErr = 'Please Select Customer'
      }
    },

    selectCustomer(customer) {
      if (!customer.active) {
        return false
      }
      this.searchCustomerErr = ''
      this.searchTerm = customer.name
      this.customerId = customer._id
      this.$store.dispatch('customer/fetchAllCustomers')
      $('#myDropdown').toggle()
    },
    search() {
      clearTimeout(this.inputTimer)
      if (this.searchTerm.length >= 2) {
        $('#searchLoader').attr('style', 'display:block')
        this.inputTimer = setTimeout(() => {
          $('#myDropdown').toggle()
          this.$store
            .dispatch('customer/searchCustomer', this.searchTerm)
            .then(() => {
              this.searchCustomerErr = ''
              $('#searchLoader').hide()
              $('#myDropdown').toggle()
              this.$store.dispatch('customer/fetchAllCustomers')
            })
            .catch(() => {
              $('#searchLoader').hide()
              this.searchCustomerErr = 'No Results Found'
              this.$store.dispatch('customer/fetchAllCustomers')
            })
        }, 500)
      }
    },
    ...mapActions('customer', ['fetchSelectedCustomer', 'addCustomer']),
  },
}
</script>

<style scoped lang="css">
.dropdown {
  position: relative;
}
#searchLoader, .dropdown-content {
  /*display:none;*/
}
.dropdown-content {
  display: block;
  position: absolute;
  background-color: #f6f6f6;
  width: 100%;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
  margin-top:3px;
  max-height:200px;
}

.dropdown-content span {
  color: black;
  padding: 6px 16px;
  text-decoration: none;
  display: block;
}
.inputSearch{
  /*width: 337px;*/
  padding-bottom: 11px;
  height: 48px;
  border-radius: 5px 0px 0px 5px;
}
.btnSuccess{
  color: #fff;
  height: 47px;
  border-radius: 0px 5px 5px 0px;
}
.dropdown span:hover {background-color: #ddd;}
</style>
