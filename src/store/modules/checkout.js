import OrderService from '@/services/data/OrderService'
import * as mutation from './checkout/mutation-types'
import mixin from '@/mixins/global/Translate'
import db from '@/services/network/DB'

// initial state
const state = {
  order: false,
  paidAmount: 0,
  payableAmount: 0,
  pendingAmount: 0,
  changedAmount: 0,
  print: false,
}

// getters
const getters = {}

// actions
const actions = {
  pay({ commit, rootGetters, rootState, dispatch }) {
    return new Promise(resolve => {
      const paid = rootGetters['checkoutForm/paid']
      commit(mutation.SET_PAID_AMOUNT, paid)
      const totalPayable = rootGetters['checkoutForm/orderTotal']
      commit(mutation.SET_PAYABLE_AMOUNT, totalPayable)

      let pendingAmount = totalPayable - paid
      pendingAmount = parseFloat(pendingAmount).toFixed()
      if (pendingAmount >= 0.01) {
        commit(mutation.SET_PENDING_AMOUNT, pendingAmount)
        commit(
          'checkoutForm/SET_ERROR',
          `Please add pending amount of ` +
            pendingAmount +
            ` before proceeding further.`,
          { root: true }
        )
      } else {
        // see if there is a change amount
        const changedAmount = paid - totalPayable
        commit(mutation.SET_CHANGED_AMOUNT, changedAmount)
        //send order for payment
        const date = new Date().toJSON().slice(0, 10)
        const time = new Date().toJSON().slice(11, 19)

        let order = {
          transition_order_no: '',
          location_id: rootState.location.location,
          payment_mode: 'Cash',
          status: 'paid',
          order_type: rootState.order.orderType,
          currency_code: rootState.location.currency,
          collected: 'no',
          order_queue: '0',
          created_date: date,
          created_time: time,
          order_mode: 'online',
          balance_due: rootGetters['order/orderTotal'],
          subtotal: rootGetters['order/subTotal'],
          amount_changed: state.changedAmount,
        }

        const cyrb53 = function(str, seed = 0) {
          let h1 = 0xdeadbeef ^ seed,
            h2 = 0x41c6ce57 ^ seed
          for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i)
            h1 = Math.imul(h1 ^ ch, 2654435761)
            h2 = Math.imul(h2 ^ ch, 1597334677)
          }
          h1 =
            Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
            Math.imul(h2 ^ (h2 >>> 13), 3266489909)
          h2 =
            Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
            Math.imul(h1 ^ (h1 >>> 13), 3266489909)
          return 4294967296 * (2097151 & h2) + (h1 >>> 0)
        }

        if (
          rootState.order.orderType == 'delivery' ||
          rootState.order.orderType == 'takeaway'
        ) {
          //its a crm/delivery order, include cusotmer id

          //get last order no from indexedDB and update it in rootstate
          let lastOrderNo = 1
          db.openDatabase(2, () => {
            db.getBucket('auth').then(bucket => {
              db.fetch(bucket).then(data => {
                if (data && data[0]) {
                  data = data[0]
                  //validate that token against api in case we need to refresh token otherwise use it
                  lastOrderNo = parseInt(data.lastOrderNo) + 1
                  commit('auth/SET_LAST_ORDER_NO', lastOrderNo, { root: true })
                }
              })
            })
          })

          const transitionOrderNo =
            rootState.auth.franchiesCode +
            '-' +
            rootState.auth.deviceCode +
            '-' +
            lastOrderNo
          order.app_uniqueid = cyrb53(transitionOrderNo)
        }

        if (rootState.order.orderType == 'delivery') {
          order.customer_id = rootState.customer.customerId
          order.address_id = rootState.customer.address
            ? rootState.customer.address.id
            : null
          order.status = 'on-hold'
        }

        //get surcharge for an order
        order.surcharge = rootGetters['surcharge/surcharge']
        //add surcharge tax
        order.surcharge_tax = rootState.tax.surchargeTax
        //add order note
        order.order_note = rootState.order.orderNote
        //add referral
        if (rootState.order.referral) {
          order.referral = rootState.order.referral.referralName
          order.referral_id = rootState.order.referral.referralId
        }
        //add future order
        if (rootState.order.futureOrder) {
          order.future_order = 1
          order.future_order_date = rootState.order.futureOrder
        }
        //adding surcharge data
        order.surchargeData = rootState.surcharge.surcharges.map(surcharge => {
          return {
            surcharge_id: surcharge._id,
            surcharge_name: surcharge.name,
            surcharge_type: surcharge.type,
            surcharge_amount: rootState.surcharge.surchargeAmounts.find(
              surchargeAmount => surchargeAmount.id == surcharge._id
            ).amount,
          }
        })

        //adding final tax
        order.final_tax = rootState.tax.surchargeTax + rootState.tax.itemsTax

        //adding item data
        order.itemData = rootState.order.items.map(item => {
          const itemTax = rootState.tax.itemsTaxData.find(
            taxData => taxData.itemId == item._id
          )
          let orderItem = {
            itemName: mixin.methods.t(item.item_name).name,
            itemId: item._id,
            itemTax: itemTax.tax,
            total: parseFloat(item.price) + parseFloat(itemTax.tax),
            item_discount_price: parseFloat(item.price),
            item_discount_id: item.discount.id,
            item_discount_name: item.discount.name,
            item_price_each: parseFloat(item.undiscountedPrice),
            item_discountontotal:
              parseFloat(item.discount.discount) * item.quantity || 0,
            quantity: item.quantity,
          }

          if (item.modifiers.length) {
            let regularModifiers = []
            let mandatoryModifiers = []
            let priceModifiers = []

            //get all modifiers by modifier ids attached to item
            let modifiers = []
            item.modifiers.forEach(modifierId => {
              rootState.modifier.itemModifiers.forEach(itemModifier => {
                itemModifier.modifiers.forEach(itemModifierItem => {
                  itemModifierItem.get_modifier_sub_groups.forEach(
                    submodifier => {
                      submodifier.get_modifier_item_list.forEach(submodItem => {
                        if (submodItem._id == modifierId) {
                          modifiers.push({
                            _id: submodItem._id,
                            location_price: submodItem.price,
                            modifierSubGroup: '5b1e281b67018b0e6f31dcb2',
                            item_name: mixin.methods.t(submodItem.item_name)
                              .name,
                            noofselection: 1,
                            type: submodItem.subgroup_type,
                          })
                        }
                      })
                    }
                  )
                })
              })
            })

            modifiers.forEach(modifier => {
              switch (modifier.type) {
                case 'mandatory':
                  mandatoryModifiers.push(modifier)
                  break
                case 'price':
                  priceModifiers.push(modifier)
                  break
                default:
                  regularModifiers.push(modifier)
              }
            })
            orderItem.modifiers = {
              regular_modifiers: regularModifiers,
              mandatory_modifiers: mandatoryModifiers,
              price_modifiers: priceModifiers,
            }
          }
          return orderItem
        })

        //order level discount
        if (rootState.discount.appliedOrderDiscount) {
          order.discount_id =
            rootState.discount.appliedOrderDiscount.discount.discount_id
          order.discount_applied = ''
          order.discount_amount =
            rootGetters['discount/orderDiscountWithoutTax']
        }

        //adding tip amount
        order.tip_amount = rootState.checkoutForm.tipAmount

        //adding payment breakdown
        order.payBreakDown = rootState.checkoutForm.payments.map(payment => {
          let paymentPart = [payment.method.name, payment.amount]
          if (payment.code) {
            paymentPart.push(payment.code)
          }
          return paymentPart
        })

        commit(mutation.SET_ORDER, order)
        resolve(dispatch('createOrder'))
      }
    })
  },
  createOrder({ state, commit, rootState }) {
    OrderService.saveOrder(state.order, rootState.customer.offlineData)
      .then(response => {
        if (response.data.data === 1) {
          //clear all the data related to order, tax, discounts, surcharge etc
          //create invoice
          commit('checkoutForm/SET_MSG', `Order Placed Successfully`, {
            root: true,
          })
        }
      })
      .catch(error => {
        commit('checkoutForm/SET_MSG', `Queued for sending later, ${error}`, {
          root: true,
        })
      })
  },
  generateInvoice({ commit }) {
    commit(mutation.PRINT, true)
  },
  reset({ commit, dispatch }) {
    commit(mutation.RESET)
    dispatch('checkoutForm/reset', null, { root: true })
    dispatch('order/reset', null, { root: true })
    dispatch('tax/reset', null, { root: true })
    dispatch('discount/reset', null, { root: true })
    dispatch('surcharge/reset', null, { root: true })
    dispatch('customer/reset', null, { root: true })
  },

  updateOrderStatus(
    { rootState },
    { orderStatus, orderId, timestamp, orderType }
  ) {
    const params = [
      rootState.location.location,
      orderStatus,
      orderId,
      orderType,
      timestamp,
    ]
    OrderService.updateOrder(...params).then(() => {})
    /*commit(mutation.SET_ORDER, order)
    dispatch('createOrder')*/
  },
}

// mutations
const mutations = {
  [mutation.SET_ORDER](state, order) {
    state.order = order
  },
  [mutation.SET_PAID_AMOUNT](state, amount) {
    state.paidAmount = amount
  },
  [mutation.SET_PAYABLE_AMOUNT](state, amount) {
    state.payableAmount = amount
  },
  [mutation.SET_PENDING_AMOUNT](state, amount) {
    state.pendingAmount = amount
  },
  [mutation.SET_CHANGED_AMOUNT](state, amount) {
    state.changedAmount = amount
  },
  [mutation.PRINT](state, flag) {
    state.print = flag
  },
  [mutation.RESET](state) {
    state.order = false
    state.paidAmount = 0
    state.payableAmount = 0
    state.pendingAmount = 0
    state.changedAmount = 0
    state.print = false
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
