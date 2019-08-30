<template>
  <div class="main-orders-contacts color-text">
    <div class="main-oreders-title">
      {{ cartType == 'hold' ? _t('Hold Orders') : _t('New Orders') }}
      <div class="main-oreders-date">{{ DateToday }}</div>
    </div>
    <div class="main-oreders-email" v-if="selectedCustomer">
      <span class="cursor-pointer color-text" @click="removeSelectedCustomer()">
        <i class="fa fa-times" aria-hidden="true"></i>
      </span>
      <p v-if="selectedCustomer.email != ''">
        {{ _t('Email') }} : {{ selectedCustomer.email }}
      </p>
      <p v-if="selectedCustomer.name != '' && selectedCustomer.email == ''">
        {{ _t('Name') }} : {{ selectedCustomer.name }}
      </p>
      <div v-if="selectedCustomer.phone_number">
        {{ _t('Phone') }} : {{ selectedCustomer.phone_number }}
      </div>
    </div>
    <div class="main-oreders-buttons" v-if="items.length">
      <div
        v-if="availableTables && orderType.OTApi === 'dine_in'"
        class="driver-container"
      >
        <form>
          <input
            autocomplete="off"
            type="text"
            placeholder="Move Table"
            class="input-search-driver"
            id="get-available-tables-list"
            v-model="selectedTable"
            @click="showTableList"
          />
        </form>
        <div
          id="available-tables"
          class="dropdown-content available-tables cursor-pointer hide"
        >
          <span class="dropdown" @click="setTable(null)">
            {{ _t('Select Table') }}
          </span>
          <span
            class="table-status"
            v-for="table in availableTables"
            :key="table._id"
            v-bind:style="{
              'border-bottom': '1px solid #ccc',
            }"
            @click="setTable(table)"
          >
            <span
              :class="'fa fa-' + table.shape"
              v-bind:style="
                table.shape != 'rectangle'
                  ? {
                      color: table.color,
                    }
                  : { background: table.color }
              "
            ></span>
            <span v-html="table.name"></span>
          </span>
        </div>
      </div>
      <!--<div
        class="orders-button-large"
        disabled="disable"
        v-if="orderType.OTApi === 'dine_in'"
      >
        {{ _t('Split Table') }}
      </div>-->
      <div
        v-if="covers && orderType.OTApi === 'dine_in'"
        class="driver-container"
      >
        <form>
          <input
            autocomplete="off"
            type="text"
            placeholder="Select Cover"
            class="input-search-driver"
            id="get-customer-list"
            v-model="OrderSelectedCover"
            @click="showDropdown"
          />
        </form>
        <div id="my-dropdown" class="dropdown-content cursor-pointer">
          <span class="dropdown" :key="0" @click="setCover(null)">
            {{ _t('Select Cover') }}
          </span>
          <span
            class="dropdown"
            v-for="cover in covers"
            :key="cover._id"
            @click="setCover(cover)"
          >
            <span v-html="cover.name"></span>
          </span>
        </div>
      </div>
      <div
        v-if="cartType !== 'hold' && orderType.OTApi === 'dine_in'"
        id="holdorder"
        class="orders-button-large color-main color-text"
        @click="hold"
      >
        {{ _t('Hold') }}
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      OrderSelectedCover: 'Select Cover',
      selectedTable: '',
      myStyle: {
        backgroundColor: '#fff',
      },
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('dinein', ['getAllCovers']),
    ...mapState('order', ['items', 'cartType', 'orderType']),
    ...mapState('checkoutForm', ['msg']),
    ...mapState('dinein', ['selectedCover', 'covers', 'availableTables']),
    ...mapState({ selectedCustomer: state => state.customer.customer }),
  },
  methods: {
    removeSelectedCustomer() {
      this.$store.commit('location/SET_MODAL', '#manage-customer')
      this.$store.dispatch('customer/resetCustomer')
    },
    showDropdown: function() {
      $('.dropdown-content').toggle()
    },
    showTableList: function() {
      $('.available-tables').toggle()
    },
    setCover: function(cover) {
      if (cover) {
        this.OrderSelectedCover = cover.name
      }
      this.$store.commit('dinein/SET_COVER', cover)
      $('.dropdown-content').hide()
    },
    setTable: function(table) {
      if (table) {
        this.$store.commit('dinein/POS_MOVE_TABLE_SELECTION', table)
        this.selectedTable = table.name
      } else {
        this.selectedTable = 'Select Table'
      }
      // this.$store.commit('dinein/AVAILABLE_TABLES', table)
      $('.available-tables').hide()
    },
    hold() {
      $('#holdorder').hide()
      this.$store
        .dispatch('checkout/pay', { action: 'on-hold' })
        .then(() => {
          if (this.msg) {
            $('#payment-msg').modal('show')
          }
          setTimeout(function() {
            $('#payment-screen-footer').prop('disabled', false)
          }, 1000)
        })
        .catch(() => {
          setTimeout(() => {
            $('#payment-msg').modal('hide')
            $('#payment-screen-footer').prop('disabled', false)
          }, 500)
        })
    },
    ...mapActions('checkout', ['orderOnHold']),
  },
}
</script>
<style lang="scss" scoped>
@import '../../../../../assets/scss/pixels_rem.scss';
@import '../../../../../assets/scss/variables.scss';
@import '../../../../../assets/scss/mixins.scss';

.hide {
  display: none;
}

@include responsive(mobile) {
  .main-orders-contacts {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: none;
    grid-row-gap: 20px;

    .cursor-pointer {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $red !important;
    }

    .main-oreders-title {
      grid-column-start: 1;
      grid-column-end: 3;
    }

    .main-oreders-email {
      padding: 10px 20px;
      border-radius: 5px;
    }

    .main-oreders-buttons {
      display: flex !important;
      align-items: center;
      margin: 0;
      #holdorder {
        width: 30%;
        background-color: $green-middle;
      }
    }
  }
}
</style>
