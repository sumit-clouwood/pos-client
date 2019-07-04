<template>
  <div class="main-orders-contacts color-text">
    <div class="main-oreders-title">
      {{ cartType == "hold" ? _t("Hold Orders") : _t("New Orders") }}
    </div>
    <div class="main-oreders-email" v-if="selectedCustomer">
      <p v-if="selectedCustomer.email != ''">
        {{ _t("Email") }} : {{ selectedCustomer.email }}
      </p>
      <p v-if="selectedCustomer.name != '' && selectedCustomer.email == ''">
        {{ _t("Name") }} : {{ selectedCustomer.name }}
      </p>
      <p v-if="selectedCustomer.phone_number">
        {{ _t("Phone") }} : {{ selectedCustomer.phone_number }}
      </p>
    </div>
    <div class="main-oreders-date">{{ DateToday }}</div>
    <div class="main-oreders-buttons" v-if="items.length">
      <!--<div class="orders-button-large" disabled="disable">
        {{ _t('Move Table') }}
      </div>
      <div class="orders-button-large" disabled="disable">
        {{ _t('Split Table') }}
      </div>-->
      <div
        v-if="cartType !== 'hold'"
        class="orders-button-large color-main color-text"
        @click="hold"
      >
        {{ _t("Hold") }}
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "Header",
  props: {},

  computed: {
    ...mapGetters("location", ["_t"]),
    ...mapState("order", ["items", "cartType"]),
    ...mapState("checkoutForm", ["msg"]),
    ...mapState({ selectedCustomer: state => state.customer.customer })
  },
  methods: {
    hold() {
      this.$store
        .dispatch("checkout/pay", { action: "on-hold" })
        .then(() => {
          /*if (this.changedAmount >= 0.1) {
            $('#payment-msg').modal('hide')
            $('#change-amount').modal('show')
          } else*/
          if (this.msg) {
            $("#payment-msg").modal("show");
          }
          setTimeout(function() {
            $("#payment-screen-footer").prop("disabled", false);
          }, 1000);
        })
        .catch(() => {
          setTimeout(() => {
            $("#payment-msg").modal("hide");
            $("#payment-screen-footer").prop("disabled", false);
          }, 500);
        });
    },
    ...mapActions("checkout", ["orderOnHold"])
  }
};
</script>
<style lang="sass" scoped>
.hide
  display : none
</style>
