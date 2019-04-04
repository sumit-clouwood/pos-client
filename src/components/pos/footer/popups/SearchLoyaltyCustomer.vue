<template>
  <!-- Add Note -->
  <div class="modal fade" id="search-loyalty-customer" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Loyalty</h4>
        </div>
        <div class="modal-body add-note-wrap">
          <div class="add-note-area">
            <p>Select customer to get loyalty</p>
            <input type="text" placeholder="Search.." v-model="searchTerm" class="inputSearch" id="getCustomerList">
            <button type="button" class="btn btnSuccess" id="load" v-on:click="search(searchTerm)" data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Processing Order">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true">Find</span>
            </button>
          </div>
          <div class="dropdown" v-if="customers.length">
            <div id="myDropdown" class="dropdown-content">
              <span
                class="showItem"
                v-for="customer in customers"
                :key="customer.customerId"
                v-on:click="selectCustomer(customer)"
                >{{ customer.customerName }}</span
              >
            </div>
            <!--            <small>{{searchTerm}}</small>-->
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              <span>X</span> Cancel
            </button>
            <button
              @click="addLoyalty"
              class="btn btn-success btn-large"
              type="button"
              id="save-note"
            >
              Select
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
import { mapState, mapActions } from 'vuex'
export default {
  name: 'SearchLoyaltyCustomer',
  props: {},
  data() {
    return {
      searchTerm: '',
      setLoyaltyInfo: '',
    }
  },
  computed: {
    ...mapState({
      customers: state => state.loyalty.loyaltyCustomerList,
    }),
  },
  methods: {
    addLoyalty: function() {
      $('#search-loyalty-customer').modal('toggle')
      this.fetchSelectedCustomer({ customerId: this.setLoyaltyInfo.customerId })
    },

    selectCustomer(customer) {
      this.searchTerm = customer.customerName
      this.setLoyaltyInfo = customer
      $('#myDropdown').toggle()
    },
    search(searchTerm) {
      $('#myDropdown').toggle()
      this.searchCustomer(searchTerm)
    },
    /*searchInputHit(searchTerm) {
      const action = this
      $('#getCustomerList').keypress(function (e) { if (e.which == 13) {
        action.searchCustomer(searchTerm)
      }})
    },*/
    ...mapActions('loyalty', ['searchCustomer']),
    ...mapActions('customer', ['fetchSelectedCustomer']),
  },

}
</script>

<style scoped lang="css">
.dropdown {
  position: relative;
}

.dropdown-content {
  /*display: block;*/
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
  width: 85%;
  height: 48px;
  border-radius: 5px 0px 0px 5px;
}
.btnSuccess{
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
  height: 47px;
  border-radius: 0px 5px 5px 0px;
}
.dropdown span:hover {background-color: #ddd;}
</style>
