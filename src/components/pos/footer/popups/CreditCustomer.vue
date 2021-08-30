<template>
  <!-- Add Note -->
  <div
    class="modal fade"
    id="credit-customer"
    role="dialog"
    data-keyboard="false"
    data-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Credit customer') }}
          </h4>
        </div>
        <progressbar
          v-if="customer_loading"
          :init="10"
          :step="10"
          :interval="1"
          :range="100"
        />
        <div class="modal-body manage-customer-wrap">
          <div class="crm-details-wrap">
            <div
              id="order-profile"
              class="profile-order order-profile-wrapper "
            >
              <form class="add-note-wrap" autocomplete="off">
                <div class="add-note-area">
                  <input
                    autocomplete="off"
                    type="text"
                    :placeholder="_t('Search Customer')"
                    class="inputSearch"
                    v-model="searchTerm"
                    @click="search"
                    v-on:keyup="search"
                    @keypress="
                      $event.keyCode == 13 ? $event.preventDefault() : true
                    "
                  />
                  <span
                    class="clear-search cursor-pointer"
                    @click="clearSearch()"
                    >x
                  </span>
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
                  <div id="customersList" class="dropdown-content">
                    <span
                      class="showItem color-dashboard-background"
                      v-for="customer in customerInList"
                      :key="customer.customerId"
                      v-on:click="selectCustomer(customer)"
                    >
                      {{ customer.name }}
                      <span
                        class="pull-right p-0"
                        :class="
                          customer.active ? 'text-success' : 'text-danger'
                        "
                      >
                        {{
                          customer.active ? _t('Activated') : _t('Deactivated')
                        }}
                      </span>
                    </span>
                  </div>
                </div>
              </form>
              <credit-customer-details
                v-if="customer_details"
                :customerId="customerId"
              ></credit-customer-details>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <div class="btn-loyalty">
              <button
                v-if="customer_details"
                type="button"
                class="btn btn-success color-text-invert color-button"
                @click="printBS"
              >
                {{ _t('Print Remaining Orders') }}
              </button>
              <button
                type="button"
                v-if="customer_details"
                class="btn btn-success cancel-announce color-text-invert color-button"
                data-dismiss="modal"
                @click="clearPaymentMethods"
              >
                {{ _t('Place Order') }}
              </button>
              <button
                data-toggle="modal"
                data-dismiss="modal"
                class="btn btn-success btn-large color-text-invert color-main"
                @click="loyaltyAddCustomer('#customer-loyalty')"
              >
                {{ _t('Create Customer') }}
              </button>
              <button
                type="button"
                class="btn btn-danger cancel-announce color-text-invert color-button"
                data-dismiss="modal"
                @click="clearSearch()"
              >
                {{ _t('Close') }}
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
import CreditCustomerDetails from './CreditCustomer/CreditCustomerDetails'
import * as CONST from '@/constants'

export default {
  name: 'credit-customer',
  props: {},
  components: {
    CreditCustomerDetails,
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
      customer_details: false,
    }
  },
  computed: {
    ...mapState({
      customers: state => state.customer.customer_list,
      customerProfile: state =>
        state.customer.customer ? state.customer.customer : false,
      pastOrders: state => state.customer.pastOrders,
    }),
    ...mapState('loyalty', ['loyalty']),
    ...mapGetters('location', ['_t', 'formatPrice']),
    ...mapState('location', ['store']),
  },
  methods: {
    clearPaymentMethods() {
      this.$store.commit('order/CREDIT_ORDER_PAYMENT', {
        order: '',
        payment_type: '',
      })
    },
    clearSearch() {
      this.clearPaymentMethods()
      this.searchTerm = ''
      this.$store.dispatch('customer/resetCustomer')
      this.customer_details = false
    },
    /*loyaltyHendlerChange() {
      this.searchTerm = ''
      this.$store.dispatch('loyaltyHendlerChange')
    },*/
    loyaltyAddCustomer: function(target) {
      this.clearPaymentMethods()
      // eslint-disable-next-line no-debugger
      this.$store.commit('loyalty/LOYALTY', true)
      // $('#create-loyalty-customer').attr('disabled', false) //Disable Save button if pressed
      $('#customer-loyalty input').val('')
      $(target).modal('show')
      // $('.nogeneral').hide()
    },

    fetchCustomer: function() {
      if (this.customerId) {
        this.searchCustomerErr = ''
        $('.text-danger').hide()
        // this.loyaltyHendlerChange()
        this.creditCustomerList(this.customerId)
          .then(() => {
            // this.searchTerm = ''
            this.$store.dispatch('checkoutForm/calculateLoyaltyAmountForItem')
            /*$('#credit-customer').modal('toggle')*/
            this.customer_loading = false
            this.customer_details = true
          })
          .catch(() => {
            this.customer_loading = false
          })
      } else {
        this.searchCustomerErr = 'Please Select Customer'
      }
    },
    printBS() {
      let dt = this.$store.state.auth.deviceType
      let isIOS = dt.osType
      if (!isIOS) {
        /*paid_order_history*/
        this.bsPrint('remaining_orders_history')
      } else {
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('iosprint_bs', '1')
        window.location.search = urlParams
      }
      // Pass the element id here
    },
    bsPrint(el) {
      const url = ''
      let name = '_blank'
      let specs = ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes']
      let replace = true
      // let styles = []
      const win = window.open(url, name, specs, replace)
      specs = specs.length ? specs.join(',') : ''

      let element = ''
      let print_header = `<div style="text-align: center;"><p>
              ${this._t('Store')}: <b>${this.store.name}</b>
               </p><p>${this._t('Name')}:
               <b style="text-transform: capitalize;">${
                 this.customerProfile.name
               }</b></p>`
      print_header += `<p>${this._t('Mobile no.')}: <b>${
        this.customerProfile.phone_number
      }</b></p></div>`
      let print_body = ''
      let print_footer = ''
      if (el === 'remaining_orders_history') {
        let amount = 0
        let total_pending_credit_orders = 0
        print_body = `<div style="display: grid;
                                grid-column-gap: 10px;
                                grid-template-columns: 1fr 1fr 1fr 1fr;
                                text-transform: capitalize;
                                grid-gap: 10px;
                                background: #f9f9f9;
                                border: 1px dashed gray;
                                align-items: baseline;
                                margin-bottom: 5px;
                                padding: 5px 15px;">

                        <b>${this._t('Order no')}</b>
                        <b>${this._t('Amount')}</b>
                        <b>${this._t('Order Type')}</b>
                        <b>${this._t('Date')}</b>
                        </div>`
        this.pastOrders.forEach(order => {
          if (
            order.credit &&
            order.order_payments.length === 1 &&
            order.order_payments[0].name === CONST.CUSTOMER_CREDIT
          ) {
            amount += parseFloat(order.balance_due)
            total_pending_credit_orders += 1
            print_body += `<div style="display: grid;
                            grid-gap: 10px;
                            border: 1px dashed gray;
                            align-items: baseline;
                            margin-bottom: 5px;
                            padding: 5px 15px;">
                            <div style="display: grid;
                                grid-column-gap: 10px;
                                grid-template-columns: 1fr 1fr 1fr 1fr;">
                                  <span>
                                    #${order.order_no}
                                  </span>
                                  <span>
                                     ${this.formatPrice(order.balance_due)}
                                  </span>
                                  <span style="text-transform: capitalize;">
                                     ${order.order_type.replace(/[_-]/g, ' ')}
                                  </span>
                                  <span>
                                     ${order.created_at}
                                  </span>
                            </div>
                        </div>`
          }
        })
        print_footer = `<div style="text-align: center; margin-top: 10px;"><b>${this._t(
          'Your remaining balance is'
        )} ${this.formatPrice(amount)}, ${this._t(
          'from'
        )} ${total_pending_credit_orders} ${this._t('orders')}.</b></div>`
      }
      element = print_header + print_body + print_footer

      if (!element) {
        alert(`Element to print #${el} not found!`)
        return
      }
      win.document.write(`
        <html>
          <head>
            <title>${this._t(' Credit orders list ')}</title>
          </head>
          <body>
            ${element}
          </body>
        </html>
      `)
      // addStyles(win, styles)

      setTimeout(() => {
        win.document.close()
        win.focus()
        win.print()
        // win.close()
        // cb()
      }, 1000)
      setTimeout(() => {
        win.close()
      }, 3000)
      return true
    },
    selectCustomer(customer) {
      this.customer_loading = true
      this.customer_details = false
      if (!customer.active) {
        return false
      }
      this.searchTerm = customer.name
      this.customerId = customer._id
      this.$store.commit('customer/SET_CUSTOMER_ID', customer._id)
      $('#customersList').toggle()
      this.fetchCustomer()
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
            $('#customersList').hide()
            this.customer_loading = true
            this.$store
              .dispatch('customer/fetchCustomers')
              .then(() => {
                this.customerInList = this.customers
                this.searchCustomerErr = ''
                $('#searchLoader').hide()
                this.customer_loading = false
                $('#customersList').show()
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
      $('#customersList').show()
    },
    ...mapActions('customer', ['creditCustomerList', 'addCustomer']),
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
.crm-details-wrap {
  .clear-search {
    position: absolute;
    right: 30px;
    top: 30px;
    font-weight: bold;
    padding: 10px;
  }
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
#credit-customer {
  z-index: 999;
  .modal-dialog {
    max-width: 60%;
  }
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
  /*.loyalty {
    background-color: transparent !important;
    border: none !important;
  }*/
  #credit-customer {
    border: none;
    overflow: hidden;
    .modal-dialog {
      border: none;
      max-width: 100%;
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
            button {
              padding-left: 5px;
              margin-left: unset;
              padding-right: 5px;
            }
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
    grid-row-gap: 5px;
  }
}
.ullist-profile {
  grid-template-columns: max-content 1fr;

  li {
    &:nth-child(3) {
      grid-column-start: 2;
      grid-column-end: 3;

      a {
        margin-top: 0 !important;
      }
    }

    &:nth-child(4) {
      display: grid;
      grid-gap: 10px;
      grid-template-columns: 1fr;
      justify-self: start;
    }

    a {
      margin: 0 !important;
    }

    .name-confrimation {
      display: grid;
    }
  }
}
</style>
