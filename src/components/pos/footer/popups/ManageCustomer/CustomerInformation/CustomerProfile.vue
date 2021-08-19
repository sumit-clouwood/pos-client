<template>
  <ul class="ullist-profile" v-if="customerProfile">
    <li>
      <img
        v-if="customerProfile.image"
        v-bind:src="customerProfile.image_path + customerProfile.image"
        alt="order-profile"
      />
      <img
        v-else
        class="profile-picture"
        src="https://d3jjfdwi6rnqlf.cloudfront.net/img/other/placeholder-img.png"
      />
    </li>
    <li class="col-md-4 lh">
      <p class="profile-customer-title color-text-invert">
        {{ _t('Customer Name:') }}
      </p>
      <h5 id="profile-customer-name color-text">
        {{ customerProfile.name }}
      </h5>
      <p class="profile-customer-title color-text">
        {{ _t('Email') }}: {{ customerProfile.email }}
      </p>
      <p class="name-confrimation color-text">
        {{ _t('Not') }} {{ customerProfile.name }}?
        <span
          class="color-text-invert"
          @click="addCustomerForm"
          data-toggle="modal"
          data-target="#customer"
          data-dismiss="modal"
        >
          {{ _t('Create New Customer') }}
        </span>
      </p>
    </li>
    <li>
      <p class="profile-customer-title color-text-invert">
        {{ _t('Phone Number:') }}
      </p>
      <h5 id="profile-customer-number color-text">
        {{ customerProfile.phone_number }}
      </h5>
      <p class="profile-customer-title">
        <small class="color-text-invert">
          {{ _t('Alternative Phone Number') }}:
          {{ customerProfile.alternative_phone }}</small
        >
      </p>
      <p class="profile-customer-title">
        <small class="color-text-invert">
          {{ _t('Customer Group') }}:
          {{ customerProfile.customer_group }}
        </small>
      </p>
    </li>
    <li @click="editCustomer(customerProfile._id)">
      <a
        class="cu-edit-icon color-text-invert color-main"
        role="button"
        data-toggle="modal"
        data-target="#customer"
        data-dismiss="modal"
      >
        <span>
          <svg
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
            </g>
          </svg>
        </span>
        {{ _t('Edit') }}</a
      >
      <a class="cu-delete-icon color-text-invert color-secondary" role="button"
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
        >{{ _t('Delete') }}</a
      >
    </li>
  </ul>
</template>

<script>
/* global $ */
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'CustomerProfile',
  computed: {
    ...mapState({
      customerProfile: state =>
        state.customer.customer ? state.customer.customer : false,
    }),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    ...mapActions('customer', ['addCustomer']),
    addCustomerForm: function() {
      this.addCustomer()
      $('#post_announcement').attr('disabled', false) //Disable Save button if pressed
      $('#customer input, #customer select').val('')
      $('.nogeneral').show()
      $('.customerAddressWrapper').show()
    },
    editCustomer: function(customerId) {
      let actionDetails = {
        id: customerId,
        action: 'edit',
        model: 'brand_customers',
      }
      $('.nogeneral').show()
      $('.customerAddressWrapper').hide()
      this.$store.dispatch('customer/editAction', actionDetails)
    },
  },
}
</script>

<style lang="scss" scoped>
.lh {
  line-height: 1;
}
</style>
