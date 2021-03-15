<template>
  <!-- Dining option Model -->
  <div class="modal fade" id="dining-option" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Dinning Option') }}
          </h4>
        </div>
        <div class="modal-body dining-options-block">
          <div
            class="dining-option-block"
            v-show="orderType.OTApi !== CONST.ORDER_TYPE_CARHOP"
          >
            <div
              v-if="enabled(CONST.MODULE_DINEIN)"
              class="option-contain"
              :class="{ active: selectedOrderType.OTApi === 'dine_in' }"
              @click="setOrderType({ OTview: 'Dine In', OTApi: 'dine_in' })"
            >
              <img src="img/pos/dine-in.svg" />
              <span class="color-text-invert">{{ _t('Dine In') }}</span>
            </div>
            <div
              v-if="enabled(CONST.MODULE_DELIVERY)"
              class="option-contain"
              :class="{ active: selectedOrderType.OTApi === 'takeaway' }"
              @click="
                setOrderType({
                  OTview: 'Take Away',
                  OTApi: 'takeaway',
                })
              "
            >
              <img src="img/pos/take-away.svg" />
              <span class="color-text-invert">{{ _t('Take Away') }}</span>
            </div>
            <div
              v-if="isBrandHasDeliveryOrder && enabled(CONST.MODULE_CRM)"
              class="option-contain"
              :class="{ active: selectedOrderType.OTApi === 'call_center' }"
              @click="
                setOrderType({ OTview: 'Delivery', OTApi: 'call_center' })
              "
            >
              <img src="img/pos/delivery-icon.svg" />
              <span class="color-text-invert">{{ _t('Delivery') }}</span>
            </div>
            <!-- <div
              class="option-contain"
              v-if="enabled(CONST.MODULE_DINEIN)"
              :class="{ active: selectedOrderType.OTApi === 'event' }"
              @click="showReservationSection()"
            >
              <img src="img/pos/reservation.svg" />
              <span class="color-text-invert">
                {{ _t('Reservation') }}
              </span>
            </div> -->
            <div
              class="option-contain"
              :class="{ active: selectedOrderType.OTApi === 'walk_in' }"
              @click="setOrderType({ OTview: 'Walk In', OTApi: 'walk_in' })"
            >
              <img src="img/pos/walkin.svg" width="35" />
              <span class="color-text-invert">{{ _t('Walk In') }}</span>
            </div>
          </div>
          <div
            class="dining-option-block"
            v-show="
              orderType.OTApi === CONST.ORDER_TYPE_CARHOP &&
                enabled(CONST.MODULE_CARHOP)
            "
          >
            <div
              class="option-contain carhop"
              :class="{
                active: selectedOrderType.OTApi === CONST.ORDER_TYPE_CARHOP,
              }"
              @click="
                setOrderType({
                  OTview: 'Carhop',
                  OTApi: CONST.ORDER_TYPE_CARHOP,
                })
              "
            >
              <img src="img/pos/carhop.svg" width="35" />
              <span class="color-text-invert">{{ _t('Carhop') }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              data-dismiss="modal"
              id="dining-opt"
              @click="updateOrderType()"
            >
              {{ _t('Ok') }}
            </button>
            <!--<button
                          class="btn btn-large"
                          type="button"
                          :class="{ active: selectedOrderType.OTApi === 'event' }"
                          @click="setOrderType({ OTview: 'Walk In', OTApi: 'walk_in' })"
                        >
                          {{ _t('Walk In') }}
            </button>-->
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Dining option model -->
</template>

<script>
/* global $ */
import { mapState, mapGetters } from 'vuex'
import * as CONST from '@/constants'

export default {
  name: 'DineIn',
  props: {},
  data: function() {
    return {
      selectedOrderType: this.$store.state.order.orderType,
    }
  },
  computed: {
    ...mapState('customer', ['isBrandHasDeliveryOrder']),
    ...mapGetters('location', ['_t']),
    ...mapGetters('auth', ['multistore']),
    ...mapState('order', ['orderType']),
    ...mapGetters('context', ['store']),
    ...mapState('dinein', ['activeArea']),
    ...mapGetters('modules', ['enabled']),
  },
  watch: {
    orderType(newVal, oldVal) {
      if (newVal != oldVal && newVal.OTApi != CONST.ORDER_TYPE_CALL_CENTER) {
        this.$store.dispatch('customer/reset')
      }
      this.selectedOrderType = newVal
      if (newVal.OTApi !== oldVal.OTApi) {
        //don't know what is this ???
        /*
        if (!this.multistore || this.multistore) {
          let OrderDiscountMS = {
            storeId: this.$store.state.context.storeId,
            orderTypeChange: true,
          }
          this.$store.commit(
            'discount/SET_MULTI_STORE_ORDER_DISCOUNTS',
            OrderDiscountMS
          )
        }
        */
        if (this.$store.state.discount.appliedOrderDiscount) {
          this.$store.dispatch('discount/clearOrderDiscount')
        } else {
          this.$store.dispatch('discount/clearItemDiscount')
        }
      }
    },
  },

  methods: {
    setOrderType(orderType) {
      if (orderType.OTApi !== 'call_center') {
        this.$store.commit('location/SET_MODAL', '#manage-customer')
        //Remove customer entity
        this.$store.dispatch('customer/resetCustomer')
      }
      if (this.selectedOrderType === orderType.OTApi) {
        //toggle
        this.selectedOrderType = { OTview: 'Walk In', OTApi: 'walk_in' }
      } else {
        this.selectedOrderType = orderType
      }
    },
    updateOrderType() {
      if (
        this.selectedOrderType.OTApi === 'dine_in' &&
        (typeof this.$store.state.dinein.covers === 'undefined' ||
          this.$store.state.dinein.covers === false)
      ) {
        //Redirect to dinein screen
        this.$router.push('/dine-in' + this.store)
      } else {
        //Set state and recalculate the cart
        this.$store.dispatch('order/updateOrderType', this.selectedOrderType)
        if (this.$route.name === 'ModifyBackendOrder') {
          this.$store.commit('order/CLEAR_SELECTED_ORDER')
          this.$store.dispatch('checkout/reset')
          this.$router.replace(
            this.store + '/order-type/' + this.selectedOrderType.OTApi
          )
        }
      }
    },
    showReservationSection() {
      this.$router.push('/dine-in' + this.store)
      this.$store
        .dispatch('dinein/updateDineInOrderStatus', {
          title: 'reservation',
          pageId: '',
        })
        .then(() => {
          $('#' + this.activeArea._id).click()
        })
    },
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.carhop {
  padding: 10px !important;

  img {
    width: 50px;
  }
}
@include responsive(mobile) {
  #dining-option {
    .modal-dialog {
      margin: 0;
      transform: none;
      animation: none;
      transition: none;
      max-width: none;

      .modal-content {
        display: grid;
        grid-template-rows: max-content 1fr max-content;

        .modal-header {
          height: 80px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: none;
          padding: 20px;
        }

        .modal-body {
          padding: 20px;
          overflow-y: auto;

          .dining-option-block {
            .option-contain {
              position: relative;

              &.active {
                border: 2px solid $green-middle;

                &::after {
                  content: '\F00C';
                  font-family: FontAwesome;
                  color: #fff;
                  background-color: $green-middle;
                  position: absolute;
                  top: -2px;
                  right: -2px;
                  border-radius: 3px;
                }
              }
            }
          }
        }

        .modal-footer {
          .btn-announce {
            button {
              background-color: $green-middle;
              border: none;
              padding: 0 25px;
            }
          }
        }
      }
    }
  }
}
</style>
