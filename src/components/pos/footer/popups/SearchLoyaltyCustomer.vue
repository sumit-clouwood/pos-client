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
        <form class="modal-body add-note-wrap" autocomplete="off">
          <div class="add-note-area">
            <p>{{ _t('Jump to customer') }}</p>
            <input
              autocomplete="off"
              type="text"
              placeholder="Search..."
              class="inputSearch"
              id="getCustomerList"
              v-model="searchTerm"
              v-on:keyup="search()"
            />
            <button
              type="button"
              class="btn btnSuccess"
              id="load"
              v-on:click="search()"
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                ><i class="fa fa-circle-o-notch fa-spin" id="searchLoader"></i>
                {{ _t('Find') }}</span
              >
            </button>
          </div>
          <div class="dropdown" v-if="customers.length">
            <div id="myDropdown" class="dropdown-content">
              <span
                class="showItem"
                v-for="customer in customers"
                :key="customer.customerId"
                v-on:click="selectCustomer(customer)"
                >{{ customer.name }}</span
              >
            </div>
            <!--            <small>{{searchTerm}}</small>-->
          </div>
        </form>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
            <button
              @click="addLoyalty"
              class="btn btn-success btn-large"
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
    }
  },
  computed: {
    ...mapState({
      customers: state => state.customer.customer_list,
    }),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    addLoyalty: function() {
      $('#search-loyalty-customer').modal('toggle')
      this.fetchSelectedCustomer(this.customerId)
    },

    selectCustomer(customer) {
      this.searchTerm = customer.name
      this.customerId = customer._id
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
              $('#searchLoader').hide()
            })
        }, 500)
      }
    },
    ...mapActions('customer', ['fetchSelectedCustomer']),
  },
}
</script>

<style scoped lang="css">
.dropdown {
  position: relative;
}
#searchLoader {
  display:none;
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
