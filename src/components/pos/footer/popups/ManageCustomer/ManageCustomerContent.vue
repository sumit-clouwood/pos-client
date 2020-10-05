<template>
  <div class="manage-customer-table">
    <Preloader v-if="loading" />
    <div v-else>
      <div v-if="!customerDetails.length">
        {{ _t('No matching customer found') }}
      </div>
      <div v-if="error">
        {{ _t(error) }}
      </div>
      <table class="table table-responsive color-tables-background" v-else>
        <thead>
          <tr>
            <th style="width: 190px" class="color-text-invert">
              {{ _t('Customer Name') }}
            </th>
            <th style="width: 140px" class="color-text-invert">
              {{ _t('Phone') }}#
            </th>
            <th style="width: 190px" class="color-text-invert">
              {{ _t('Email') }}
            </th>
            <th style="width: 155px" class="color-text-invert">
              {{ _t('Reference Code') }}
            </th>
            <th style="width: 250px" class="color-text-invert">
              {{ _t('City') }}
              <!--, {{ _t('Location') }}-->
            </th>
            <th style="width: 250px" class="color-text-invert">
              {{ _t('Status') }}
              <!--, {{ _t('Location') }}-->
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="referal-code-customer"
            v-for="(customer, index) in customerDetails"
            v-bind:class="{ active: activeIndex === index }"
            v-on:click="setActiveCustomer(index)"
            :key="index"
          >
            <td class="color-text">
              {{ customer.name }}
            </td>
            <td class="color-text">{{ customer.phone_number }}</td>
            <td class="color-text">{{ customer.email }}</td>
            <td class="color-text">
              <!-- <button
                          data-toggle="modal"
                          data-target="#display-order"
                          data-dismiss="modal"
                          @click="fetchSelectedCustomer(customer._id)"
                          class="br-table-btn display-order color-icon-table-neutral-button color-text-invert"
                        >
                          {{ _t('Display Order') }}
                        </button>-->
            </td>
            <td>
              <button
                v-if="!customer.active"
                class="btn btn-default order-add deactive-table-btn color-text-invert"
              >
                {{ _t('Edit Details') }}
              </button>
              <button
                v-else
                @click="fetchSelectedCustomer(customer._id)"
                data-toggle="modal"
                data-target="#display-order"
                data-dismiss="modal"
                class="br-table-btn edit-info color-icon-table-neutral-button color-text-invert"
              >
                {{ _t('Edit Details') }}
              </button>
              <span>
                {{ getCustomerLocation(customer.customer_addresses) }}
              </span>
            </td>
            <td v-if="orderType.OTApi === 'dine_in'">
              <button
                @click="selectCustomer(customer._id)"
                data-toggle="modal"
                data-dismiss="modal"
                class="br-table-btn edit-info color-icon-table-neutral-button color-text-invert"
              >
                {{ _t('Select Customer') }}
              </button>
              <span>
                {{ getCustomerLocation(customer.customer_addresses) }}
              </span>
            </td>
            <td class="color-text" v-else>
              <button
                v-if="!customer.active"
                class="btn btn-default order-add deactive-table-btn color-text-invert"
              >
                {{ _t('Deactivated') }}
              </button>
              <button
                v-else
                @click="fetchSelectedCustomer(customer._id)"
                data-toggle="modal"
                :data-target="addressPopup"
                data-dismiss="modal"
                class="br-table-btn order-add color-icon-table-neutral-button color-text-invert"
              >
                {{ _t('Add to Order') }}
              </button>
              <span>{{ customer.active ? 'Activated' : 'Deactivated' }}</span>
            </td>
            <!--<td class="color-text more-button">More</td>-->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Preloader from '@/components/util/Preloader'
import { bus } from '@/eventBus'
/* global $ */
export default {
  name: 'ManageCustomerContent',
  components: {
    Preloader,
  },
  computed: {
    ...mapState({
      customerDetails: state => state.customer.customer_list,
    }),
    ...mapState('customer', ['loading', 'isBrandHasDeliveryOrder']),
    ...mapState('order', ['orderType']),
    ...mapGetters('location', ['_t']),
    addressPopup() {
      return !this.isBrandHasDeliveryOrder ? '' : '#add-to-order'
    },
  },
  data: function() {
    return {
      activeIndex: '',
      error: false,
      custBlockHeight: 0,
      custBlockInitHeight: 0,
      custBlockItemHeight: 0,
    }
  },
  watch: {
    customerDetails(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$nextTick(() => {
          bus.$emit('check-height')
          this.custAreaCalculation()
        })
      }
    },
  },
  updated() {
    this.custAreaCalculation()
    bus.$on('check-height', () => {
      this.custAreaCalculation()
    })
    if (this.activeIndex != '') {
      if (typeof $('.last-order-wrap')[0] != 'undefined') {
        $('.last-order-wrap')[0].slick.refresh()
      }
    }
    // this.props.customerId = customerId
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
    setActiveCustomer(index) {
      this.activeIndex = index
    },
    getCustomerLocation(customerAddress) {
      if (customerAddress.length) {
        return customerAddress[0].city
      }
    },
    selectCustomer(id) {
      this.$store
        .dispatch('customer/fetchSelectedCustomer', id)
        .then(() => (this.error = false))
        .catch(error => {
          this.error = error
          this.$store.commit('customer/SET_CUSTOMER_LOADING', false)
        })
    },
    fetchSelectedCustomer(id) {
      this.$store
        .dispatch('customer/fetchSelectedCustomer', id)
        .then(() => (this.error = false))
        .catch(error => {
          this.error = error
          this.$store.commit('customer/SET_CUSTOMER_LOADING', false)
        })
    },
  },
}
</script>
<style lang="scss">
.more-button {
  background-color: #4b4e53;
  grid-column-start: 2 !important;
  grid-column-end: 3 !important;
  grid-row-start: 3;
  grid-row-end: 4;
  color: #fff !important;
  font-weight: bold;
  opacity: 1;
  align-items: center;
  justify-content: center;
}
</style>
