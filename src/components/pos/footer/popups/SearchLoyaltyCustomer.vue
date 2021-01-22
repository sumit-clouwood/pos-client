<template>
  <!-- Add Note -->
  <div
    class="modal fade"
    id="search-loyalty-customer"
    role="dialog"
    @click.self="loyaltyHendlerChange"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Loyalty') }}
          </h4>
        </div>
        <progressbar
          v-if="customer_loading"
          :init="10"
          :step="10"
          :interval="1"
          :range="100"
        />
        <form class="modal-body add-note-wrap" autocomplete="off">
          <p class="color-text-invert">{{ _t('Jump to customer') }}</p>
          <div class="add-note-area">
            <input
              autocomplete="off"
              type="text"
              :placeholder="_t('Search')"
              class="inputSearch"
              v-model="searchTerm"
              @click="search"
              v-on:keyup="search"
              @keypress="$event.keyCode == 13 ? $event.preventDefault() : true"
            />
          </div>
          <span
            class="loyalty-error text-danger loyalty-customer-error color-warning"
          >
            {{ _t(searchCustomerErr) }}
          </span>
          <div
            class="dropdown"
            v-if="customerInList.length && searchTerm.length"
          >
            <div id="myDropdown" class="dropdown-content">
              <span
                class="showItem color-dashboard-background"
                v-for="customer in customerInList"
                :key="customer.customerId"
                v-on:click="selectCustomer(customer)"
              >
                {{ customer.name }}
                <span
                  class="pull-right p-0"
                  :class="customer.active ? 'text-success' : 'text-danger'"
                >
                  {{ customer.active ? _t('Activated') : _t('Deactivated') }}
                </span>
              </span>
            </div>
          </div>
        </form>
        <div class="modal-footer">
          <div class="btn-announce">
            <div
              data-toggle="modal"
              data-dismiss="modal"
              class="cursor-pointer blue-middle color-text-invert"
              @click="loyaltyAddCustomer('#customer-loyalty')"
            >
              {{ _t('Create Customer') }}
            </div>
            <div class="btn-loyalty">
              <button
                @click="addLoyalty"
                class="btn btn-success btn-large color-text-invert color-main"
                type="button"
                id="save-note"
              >
                {{ _t('Select') }}
              </button>
              <button
                type="button"
                class="btn btn-danger cancel-announce color-text-invert color-button"
                data-dismiss="modal"
                @click="loyaltyHendlerChange"
              >
                {{ _t('Cancel') }}
              </button>
            </div>
          </div>
        </div>

        <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
      </div>
    </div>
  </div>

  <!-- Add note -->
  <!-- ====================================== -->
</template>
<script>
/* global $ */
import { mapState, mapActions, mapGetters } from 'vuex'
import progressbar from '@/components/util/progressbar'

export default {
  name: 'SearchLoyaltyCustomer',
  props: {},
  components: {
    progressbar,
  },
  data() {
    return {
      searchTerm: '',
      customerId: '',
      inputTimer: '',
      searchCustomerErr: '',
      customerInList: '',
      customer_loading: '',
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
    loyaltyHendlerChange() {
      this.searchTerm = ''
      this.$store.dispatch('loyaltyHendlerChange')
    },
    loyaltyAddCustomer: function(target) {
      // eslint-disable-next-line no-debugger
      // this.$store.commit('loyalty/LOYALTY', true)
      // $('#create-loyalty-customer').attr('disabled', false) //Disable Save button if pressed
      $('#customer-loyalty input').val('')
      $(target).modal('show')
      // $('.nogeneral').hide()
    },

    addLoyalty: function() {
      if (this.customerId) {
        this.searchCustomerErr = ''
        $('.text-danger').hide()
        this.loyaltyHendlerChange()
        this.fetchSelectedCustomer(this.customerId)
          .then(() => {
            // this.searchTerm = ''
            this.$store.dispatch('checkoutForm/calculateLoyaltyAmountForItem')
            $('#search-loyalty-customer').modal('toggle')
            this.customer_loading = false
          })
          .catch(() => {
            // alert(1)
            this.customer_loading = false
          })
      } else {
        this.searchCustomerErr = 'Please Select Customer'
      }
    },

    selectCustomer(customer) {
      this.customer_loading = true
      if (!customer.active) {
        return false
      }
      this.searchTerm = customer.name
      this.customerId = customer._id
      $('#myDropdown').toggle()
      this.addLoyalty()
    },
    search() {
      clearTimeout(this.inputTimer)
      let trimSearchTrm = this.searchTerm.trim()
      if (trimSearchTrm.length >= 1) {
        this.inputTimer = setTimeout(() => {
          $('#searchLoader').attr('style', 'display:block')
          this.$store.commit('customer/FETCH_ALL', 'brand_customers_main_tbl')
          this.$store.commit('customer/SET_SEARCH_TERMS', trimSearchTrm)
          let customers = this.customers.filter(customer => {
            if (
              customer.name.toLowerCase().match(trimSearchTrm.toLowerCase())
            ) {
              return customer
            }
          })
          if (customers.length) {
            this.customerInList = customers
            $('#searchLoader').hide()
          } else {
            $('#myDropdown').hide()
            this.customer_loading = true
            this.$store
              .dispatch('customer/fetchCustomers')
              .then(() => {
                this.customerInList = this.customers
                this.searchCustomerErr = ''
                $('#searchLoader').hide()
                this.customer_loading = false
                $('#myDropdown').show()
              })
              .catch(() => {
                // eslint-disable-next-line no-console
                console.log('now here')
                $('#searchLoader').hide()
                this.searchCustomerErr = 'No Results Found'
              })
          }
        }, 1000)
      } else {
        this.customerInList = this.customers
        this.searchTerm =
          this.searchTerm === ' ' && !this.customerInList ? '' : ' '
        // eslint-disable-next-line no-console
        console.log('here', this.customerInList)
        $('#searchLoader').hide()
      }
    },
    showCustomers() {
      $('#myDropdown').show()
    },
    ...mapActions('customer', ['fetchSelectedCustomer', 'addCustomer']),
  },
}
</script>
<!-- eslint-disable max-len -->
<style scoped lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.dropdown {
  position: relative;
}

#searchLoader,
.dropdown-content {
}

.dropdown-content {
  display: block;
  position: absolute;
  @include responsive(mobile) {
    position: static;
    max-height: 100px !important;
  }
  background-color: #f6f6f6;
  width: 100% !important;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
  margin-top: 3px;
  max-height: 140px;
}
.showItem {
  border-bottom: 1px #e4e4e4 solid;
  //font-weight: bold;
}
.dropdown-content span {
  text-transform: capitalize;
  color: black;
  padding: 6px 16px;
  text-decoration: none;
  display: block;
}

.inputSearch {
  padding-bottom: 11px;
  height: 48px;
  border-radius: 5px 0px 0px 5px;
}

.btnSuccess {
  color: #fff;
  height: 47px;
  height: 3.125rem;
  border-radius: 0px 5px 5px 0px;
}
.cancel-announce,
#save-note {
  height: 3.125rem;
}

.dropdown span:hover {
  background-color: #ddd;
}

.cursor-pointer {
  margin-right: 1.5rem;
  font-size: 1rem;
}

@include responsive(mobile) {
  .loyalty {
    background-color: transparent !important;
    border: none !important;
  }
  #search-loyalty-customer {
    border: none;
    overflow: hidden;
    .modal-dialog {
      border: none;
      .modal-content {
        border: none;
        /*top: auto;*/
        .modal-header {
          background-color: #fff;
          display: grid !important;
          align-items: center;
          padding: 20px;
          border: none;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .modal-body {
          display: grid;
          grid-template-rows: max-content max-content max-content 1fr max-content;
          padding-bottom: 0;

          .add-note-area {
            height: 50px;

            .inputSearch {
              /*width: 100vw !important;*/
              border-radius: 0;
              /*margin-top: 20px;*/
              outline: none;
              margin-bottom: 0;
              width: 96% !important;
            }
          }
        }

        .modal-footer {
          padding: 5px !important;
          display: grid;
          grid-template-columns: 1fr;
          grid-row-gap: 10px;
          .cursor-pointer {
            background-color: $green-middle;
            color: #fff;
            border-radius: 3px;
            display: grid;
            align-items: center;
            justify-content: center;
            text-align: center;
            height: 50px !important;
            margin-right: 0px !important;
          }
          .btn-announce {
            width: 90% !important;
            margin: auto;
          }
        }
      }
    }
  }
  .cancel-announce,
  .cursor-pointer,
  #save-note {
    font-size: 1rem !important;
  }
  .btn-loyalty {
    display: grid;
    grid-template-columns: repeat(2, 1fr) !important;
    column-gap: 0.5rem;
  }
}
</style>
