<template>
  <div :class="['selectDiscount', { active: discountHendler }]">
    <discount />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import discount from '../pos/footer/popups/Discount.vue'

export default {
  computed: {
    ...mapGetters(['discountHendler']),
  },
  components: {
    discount,
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #select-discount {
    display: none !important;

    .modal-dialog {
      .modal-content {
        grid-template-rows: max-content 1fr max-content;
      }
    }
  }
  .selectDiscount {
    position: fixed;
    width: 100vw;
    top: 0;
    right: -100vw;
    bottom: 0;
    z-index: 1060;
    background-color: transparent;

    &.active {
      right: 0;
    }

    #select-discount {
      display: grid !important;
      opacity: 1;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0 !important;

      .modal-dialog {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: auto;
        min-height: auto;
        margin: 0;
        transform: none;
        max-width: 100%;

        .modal-content {
          .modal-header {
            background-color: #fff;
            padding: 20px;
            border: none;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 1;

            .customer-title {
              font-size: 16px;
            }
          }

          .modal-body {
            .dining-option-block {
              grid-template-rows: 1fr 1fr;
              grid-template-rows: none;
              align-items: start;
              align-content: start;
            }
          }

          .modal-footer {
            .btn-announce {
              button {
                padding: 0 35px;
                height: 50px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
