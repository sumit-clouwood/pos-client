<template>
  <div class="main-orders-contacts">
    <div class="main-oreders-title">{{ _t('New Orders') }}</div>
    <div class="main-oreders-email" v-if="selectedCustomer">
      <p v-if="selectedCustomer.email != ''">
        {{ _t('Email') }} : {{ selectedCustomer.email }}
      </p>
      <p v-if="selectedCustomer.name != '' && selectedCustomer.email == ''">
        {{ _t('Name') }} : {{ selectedCustomer.name }}
      </p>
      <p v-if="selectedCustomer.phone_number">
        {{ _t('Phone') }} : {{ selectedCustomer.phone_number }}
      </p>
    </div>
    <div class="main-oreders-date">{{ DateToday }}</div>
    <div class="main-oreders-buttons">
      <div class="orders-button-large" disabled="disable">
        {{ _t('Move Table') }}
      </div>
      <div class="orders-button-large" disabled="disable">
        {{ _t('Split Table') }}
      </div>
      <div class="orders-button-large">{{ _t('Hold') }}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Header',
  props: {},

  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState({ selectedCustomer: state => state.customer.customer }),
  },
}
</script>
<style lang="sass" scoped>
.hide
  display : none
</style>
