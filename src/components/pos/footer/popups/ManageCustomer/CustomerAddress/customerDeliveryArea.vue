<template>
  <div
    class="order-location option-contain"
    v-bind:class="{
      active: activeIndex === index
    }"
    v-on:click="setActiveCustomer(index, address._id, getDeliveryArea(address.delivery_area))"
  >
    <p>
      <span>{{ locationName }}</span>
      {{ getDeliveryArea(address.delivery_area) }}, {{ address.street }},
      {{ address.city }},
      {{ country }}
    </p>
    <p v-if="buttons" class="cu-location-select">
      <span
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="17"
          viewBox="0 0 11 17"
        >
          <path
            fill="#566177"
            fill-rule="evenodd"
            d="M5.5 0a5.49 5.49 0 0 0-3.535 1.286A5.504 5.504 0 0 0 .737 8.25l4.019 5.758a.861.861 0 0 0 1.489 0l4.019-5.758a5.504 5.504 0 0 0-1.228-6.964A5.49 5.49 0 0 0 5.5 0zM3.094 4.469a.343.343 0 1 0 0 .687h4.813a.343.343 0 1 0 0-.687H3.094zm0 1.375a.343.343 0 1 0 0 .688h4.813a.343.343 0 1 0 0-.688H3.094zm-.516 6.74c-.049 0-.098.01-.143.031-.62.29-1.1.677-1.303 1.144-.207.476-.09 1.035.296 1.46.77.852 2.338 1.282 4.072 1.282 1.735 0 3.303-.43 4.072-1.281.385-.426.503-.985.297-1.46-.202-.465-.687-.854-1.301-1.143a.344.344 0 0 0-.288.623c.543.248.852.55.957.793.106.243.08.444-.174.725-.51.563-1.955 1.055-3.563 1.055s-3.053-.492-3.562-1.055c-.255-.281-.281-.482-.175-.725.105-.243.415-.544.958-.793a.345.345 0 0 0-.143-.656z"
          />
        </svg> </span
      ><span
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
        >
          <g
            fill="none"
            fill-rule="evenodd"
            stroke="#566177"
            transform="translate(-1 -1)"
          >
            <path
              d="M2.504 15.756l3.608-.792a1.83 1.83 0 0 0 .27-.07.354.354 0 0 0 .085-.047c.04-.03.08-.065.204-.19l9.908-9.907c.234-.234.291-.32.325-.431a.409.409 0 0 0 0-.245c-.034-.111-.091-.196-.325-.43L14.856 1.92c-.234-.234-.319-.291-.43-.325a.409.409 0 0 0-.245 0c-.112.034-.197.091-.43.325l-9.94 9.94c-.118.118-.15.153-.178.19a.347.347 0 0 0-.045.074 2.032 2.032 0 0 0-.081.246l-1.003 3.385z"
            />
            <rect
              width="11"
              height="1"
              x="4.5"
              y="8.5"
              rx=".5"
              transform="rotate(-45 10 8.5)"
            />
          </g></svg
      ></span>
      <span
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="18"
          viewBox="0 0 16 18"
        >
          <g fill="none" fill-rule="evenodd" stroke="#DE3C3C">
            <path
              d="M2.278 4.808V15.23a1.5 1.5 0 0 0 1.5 1.5h8.444a1.5 1.5 0 0 0 1.5-1.5V4.808H2.278zM6.727 1.654l.079.57H1.723a1.223 1.223 0 0 0 0 2.445h12.554a1.223 1.223 0 0 0 0-2.446H9.194l.079-.569a.509.509 0 0 0 .005-.07V1a.5.5 0 0 0-.5-.5H7.222a.5.5 0 0 0-.5.5v.585c0 .023.002.047.005.07z"
            />
            <rect
              width="1"
              height="4.169"
              x="5.833"
              y="8.254"
              fill="#D8D8D8"
              rx=".5"
            />
            <rect
              width="1"
              height="4.169"
              x="10.278"
              y="8.254"
              fill="#D8D8D8"
              rx=".5"
            />
          </g></svg
      ></span>
    </p>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'CustomerDeliveryAreas',
  props: {
    buttons: Boolean,
    address: Object,
    index: Number,
  },
  data: function() {
    return { activeIndex: '' }
  },
  computed: {
    ...mapState({
      deliveryAddresses: state =>
        state.customer.customer.customer_list
          ? state.customer.customer.customer_list.customer_details
          : false,
    }),
    ...mapState({
      locationName: state => state.location.locationName,
    }),
    ...mapState({
      country: state =>
        typeof state.location.locationData !== 'undefined'
          ? state.location.locationData.country_name
          : '',
    }),

    ...mapGetters('location', ['getDeliveryArea']),
  },
  methods: {
    setActiveCustomer(index, selectedCustomerAddressId, selectedCustomerAddressArea) {
      if (this.activeIndex === index) {
        this.activeIndex = null
      } else {
        $('.location-delivery-area-address').find('.active').removeClass('active')
        this.activeIndex = index
      }
      this.selectedAddress(selectedCustomerAddressId, selectedCustomerAddressArea)
    },
	  ...mapActions('customer', ['selectedAddress']),
  },
}
</script>
