<template>
  <ul class="ullist-profile" v-if="customerProfile">
    <li>
      <img
        v-bind:src="customerProfile.image_path + customerProfile.image"
        alt="order-profile"
      />
    </li>
    <li>
      <p class="profile-customer-title">Customer Name:</p>
      <h2 id="profile-customer-name">
        {{ customerProfile.customer_name }}
      </h2>
      <p class="name-confrimation">
        Not Beby?
        <span data-toggle="modal" data-target="#customer" data-dismiss="modal"
          >Create new customer</span
        >
      </p>
    </li>
    <li>
      <p class="profile-customer-title">Phone Number:</p>
      <h2 id="profile-customer-number">{{ customerProfile.mobile_number }}</h2>
    </li>
    <li>
      <a class="cu-edit-icon" href="#"
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
            </g></svg></span
        >Edit</a
      ><a class="cu-delete-icon" href="#"
        ><span
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
            </g></svg></span
        >Delete</a
      >
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CustomerProfile',
  computed: {
    ...mapState({
      customerProfile: state =>
        state.customer.customer.customer_list
          ? state.customer.customer.customer_list
          : false,
    }),
  },
}
</script>
