<template>
  <!-- order confrmation  -->
  <div class="modal fade" id="order-confirmation" role="dialog">
    <div
      class="modal-dialog modal-dialog-centered"
      :class="{ 'error-dialog': !cartItems }"
    >
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background" v-if="cartItems">
        <SendToDeliveryHeader />
        <SendToDeliveryContent />
        <SendToDeliveryFooter />
      </div>
      <div
        class="modal-content text-center text-danger pt-3 color-dashboard-background"
        v-else
      >
        <div class="order-header">
          <h4 class="order-confirm-title">
            {{ _t('No items added to order') }}
          </h4>
          <p>
            {{
              _t('Please add some item(s) to order before sending to delivery')
            }}
          </p>
        </div>
        <div class="modal-body order-confirmation-wrap"></div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button"
              data-dismiss="modal"
            >
              {{ _t('Close') }}
            </button>
          </div>

          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Order confirmation  -->
</template>

<script>
import SendToDeliveryHeader from './SendToDelivery/SendToDeliveryHeader'
import SendToDeliveryContent from './SendToDelivery/SendToDeliveryContent'
import SendToDeliveryFooter from './SendToDelivery/SendToDeliveryFooter'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'SendToDelivery',
  props: {},
  components: {
    SendToDeliveryHeader,
    SendToDeliveryContent,
    SendToDeliveryFooter,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState({
      cartItems: state =>
        state.order.items.length > 0 ? state.order.items : false,
    }),
  },
}
</script>
<style lang="scss" scoped>
.error-dialog {
  height: 280px !important;

  .order-header {
    p {
      font-size: inherit;
    }
  }
}
</style>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #order-confirmation {
    .modal-dialog {
      margin: 0;
      width: auto !important;
      max-width: none !important;

      .modal-content {
        .order-header {
          margin: 0;
          padding: 20px;
          height: 80px;
          min-height: 80px;
          border-bottom: 1px solid $gray-middle;
          align-items: flex-start;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: none;

          h4 {
            text-align: left;
          }
        }

        .modal-body {
          overflow: auto;
          padding: 10px;

          .order-table {
            max-height: none;
            /*width: 100%;*/
            .table-responsive {
              margin: 0;
            }
            table {
              width: auto;
              /*display: grid;*/
              /*grid-template-columns: 1fr 1fr;*/
              /*grid-gap: 10px;*/
              /*justify-content: space-between;*/

              tr {
                /*display: grid;*/
                border: 1px solid #eee;
                border-radius: 3px;
                padding: 0 10px;

                /*&:first-child {*/
                /*  display: none;*/
                /*}*/

                th,
                td {
                  text-align: left;
                  /*width: auto !important;*/
                  border-bottom: 1px solid $gray-middle !important;
                  border-top: none !important;
                  height: 40px;
                  /*padding: 0;*/
                  line-height: 40px;
                  /*display: flex;*/
                  /*align-items: center;*/
                }

                td {
                  box-sizing: content-box;

                  &:last-child {
                    border-bottom: none !important;
                  }

                  &:nth-child(1) {
                    box-sizing: border-box;
                  }
                }
              }
            }
          }

          #total-order-wrap {
            .order-notes {
              width: 100%;
            }

            #total-confirm-order {
              margin: 20px 0 0 0;
              width: 100%;

              .order-amt-charges {
                p {
                  justify-content: flex-end;
                }
              }

              p {
                display: flex;
                align-items: center;
              }
            }
          }
        }

        .modal-footer {
          display: grid;
          grid-template-columns: 1fr;
          width: 100% !important;
          grid-gap: 10px;
          border: none;

          .referal {
            width: 100% !important;
            button {
              width: 100% !important;
            }

            .vdatetime {
              order: 1;
              width: 100% !important;

              input {
                margin: 0;
                width: 100%;
              }
            }
          }

          .btn-announce {
            btn-announce {
              margin-left: auto;
            }

            .btn-danger {
            }
          }
        }
      }
    }
  }
}
</style>
