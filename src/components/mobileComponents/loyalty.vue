<template>
  <div :class="['loyalty', { active: loyaltyHendler }]">
    <search-loyalty-customer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import searchLoyaltyCustomer from '../pos/footer/popups/SearchLoyaltyCustomer'

export default {
  name: 'loyalty',
  components: {
    searchLoyaltyCustomer,
  },
  computed: {
    ...mapGetters(['loyaltyHendler']),
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #search-loyalty-customer {
    display: none !important;
  }
  .loyalty {
    position: fixed;
    width: 100vw;
    top: 0;
    right: -100vw;
    bottom: 0;
    z-index: 1060;
    border-left: 1px solid #eee;

    &.active {
      right: 0;
    }

    #search-loyalty-customer {
      display: block !important;
      opacity: 1;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100% !important;

      .modal-dialog {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: auto;
        min-height: auto;
        max-width: 100%;
        margin-top: 20vh;
        transform: none;

        .modal-content {
          grid-template-rows: max-content 1fr max-content;

          .modal-header {
            display: none;
          }

          .modal-body {
            .add-note-area {
              p {
                margin: 0;
                margin-bottom: 20px;
                font-size: 16px;
              }

              input {
                height: 50px;
                padding: 0 20px;
                margin-bottom: 20px;
              }

              button {
                padding: 0 35px;
                height: 50px;
              }
            }
          }

          .modal-footer {
            .btn-announce {
              button {
                height: 50px;
                padding: 0 35px;
                border-radius: $btn-border-radius;
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
