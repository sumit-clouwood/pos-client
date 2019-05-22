<template>
  <div>
    <div class="wrappers-new-orders">
      <div class="order">
        <h5>New Orders</h5>
        <p>
          {{ todayDateFull }}
        </p>
      </div>
      <div class="account-name" v-if="selectedCustomer">
        <p v-if="selectedCustomer.email != ''">
          Email : {{ selectedCustomer.email }}
        </p>
        <p v-if="selectedCustomer.name != '' && selectedCustomer.email == ''">
          Name : {{ selectedCustomer.name }}
        </p>
        <p v-if="selectedCustomer.phone_number">
          Phone : {{ selectedCustomer.phone_number }}
        </p>
      </div>
    </div>
    <div class="table-pos-btn hide">
      <button type="" class="popup-btn-save">Move Table</button>
      <button type="" class="popup-btn-save">Split Table</button>
      <button type="" class="popup-btn-save">Hold</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Header',
  props: {},
  computed: {
    ...mapGetters('sync', ['todayDateFull']),
    ...mapState({ selectedCustomer: state => state.customer.customer }),
  },
}
</script>
<style lang="sass" scoped>
.hide
  display : none
</style>
