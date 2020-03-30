<template>
  <div class="search-field color-text-invert color-dashboard-background">
    <div class="search-field-icon" @click="searchHendlerChange()">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4ZM2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11Z"
          fill="#4B4E53"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15.9428 15.9428C16.3333 15.5523 16.9665 15.5523 17.357 15.9428L21.707 20.2928C22.0975 20.6833 22.0975 21.3165 21.707 21.707C21.3165 22.0975 20.6833 22.0975 20.2928 21.707L15.9428 17.357C15.5523 16.9665 15.5523 16.3333 15.9428 15.9428Z"
          fill="#4B4E53"
        />
      </svg>
    </div>
    <form>
      <input
        type="text"
        autocomplete="off"
        class="search-field-input"
        :class="['input-wrapper', { active: searchHendler }]"
        :placeholder="_t('Search or scan for items')"
        v-model="searchTransactions"
        @keyup="searchingItems()"
        @keypress="$event.keyCode == 13 ? $event.preventDefault() : true"
      />
    </form>
    <div class="search-field-icon home">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Search',
  props: {},
  data() {
    return {
      searchTransactions: '',
    }
  },
  computed: {
    ...mapGetters('location', ['_t', 'timezoneString']),
    ...mapGetters([
      'searchHendler',
      'allCategoryHendler',
      'subCategoryHendler',
    ]),
  },
  mounted() {
    this.searchTransactions = ''
  },
  methods: {
    searchingItems() {
      if (this.searchTransactions.trim().length >= 1) {
        this.$store.dispatch(
          'transactionOrders/setTransactionOrders',
          this.searchTransactions
        )
      } else {
        this.fetchOrders()
      }
    },
    searchHendlerChange() {
      this.$store.dispatch('searchHendlerChange')
    },
    fetchOrders() {
      let scope = this
      this.$store
        .dispatch('transactionOrders/getTransactionOrders')
        .then(function() {
          scope.$store.dispatch(
            'transactionOrders/selectFirstTransactionOrder',
            {
              root: true,
            }
          )
          scope.$store.dispatch('transactionDetail')
        })
    },
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.transaction-orders .search-field-icon.home {
  display: none;
}

@include responsive(mobile) {
  .search-field {
    margin-top: 0;
    border-radius: 0;
    border: none;
    grid-template-columns: 65px 1fr 65px !important;
    align-items: stretch;
    height: 100%;

    .search-field-icon {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .input-wrapper {
      display: none;
      grid-column-start: 2;
      grid-column-end: 4;
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      height: 100%;

      &.active {
        display: grid;
        .search-field-input {
          right: 1px;
        }
      }

      .search-field-input {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
        border-left: 1px solid $gray-middle;
        transition: 0.3s ease-out;
        font-family: 'ProximaNova-Regular';
        font-size: 14px;
        border-radius: 10px;
      }

      .allCategory {
        border-right: 1px solid $gray-middle;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        transition: 0.3s ease-out;

        &.notActive {
          /*display: none;*/
        }

        &.active {
          color: $green-middle;
        }

        .fa {
          margin-left: $px10;
          font-weight: 600;
          font-size: $px18;
          transition: 0.3s ease-out;

          &.active {
            transform: rotate(180deg);
          }
        }
      }

      .subCategory {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        transition: 0.3s ease-out;

        &.notActive {
          /*display: none;*/
        }

        &.active {
          color: $green-middle;
        }

        .fa {
          margin-left: $px10;
          font-weight: 600;
          font-size: $px18;
          transition: 0.3s ease-out;

          &.active {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}
</style>
