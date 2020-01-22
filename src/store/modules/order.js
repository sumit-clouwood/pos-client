/*or example tax for an item is 2.467
suppose quantity is 3
2.467 * 3 = 7.401

but if round it before adding
2.47 * 3 = 7.41

It is 7.41 - 7.40 = 0.01

Both have difference of 0.01 that can have a huge impact as we grow in orders

badr, 12:02 PM
yes but you should not charge 7.41
you should charge 7.40

*/
/* eslint-disable no-console */
import * as mutation from './order/mutation-types'
import OrderService from '../../services/data/OrderService'
import * as CONST from '@/constants'
import Num from '@/plugins/helpers/Num.js'
import DateTime from '@/mixins/DateTime.js'

// initial state
const state = {
  items: [],
  item: false,
  errors: '',
  orderType: { OTview: 'Walk In', OTApi: 'walk_in' },
  orderNote: '',
  cancellationReason: {},
  onlineOrders: false,
  futureOrder: false,
  referral: false,
  selectedOrder: false,
  orderId: null,
  orderData: false,
  // pastOrder: false,
  orderStatus: null,
  cartType: 'new',
  is_pay: 1,
  startTime: null,
  orderToModify: null,
  splitBill: null,
  splittedItems: {},
  splitted: false,
  totalItems: 0,
  totalItemsPaid: 0,
  orderSource: null,
  modificationReasons: [],
  processing: false,
  inventoryBehavior: ['waste', 'return'],
}

// getters
const getters = {
  deliverySurcharge: (state, getters, rootState) => {
    if (rootState.customer.address) {
      return rootState.customer.address.special_order_surcharge || 0
    }
    return 0
  },
  orderIndex: state => {
    if (!state.items.length) {
      return 0
    }
    const lastItem = state.items[state.items.length - 1]
    return lastItem.orderIndex + 1
  },

  item: state => state.item,

  netPrice: () => item => {
    return item.grossPrice / ((100 + item.tax_sum) / 100)
  },

  grossPrice: () => item => {
    if (!item.value) item.value = 0
    return Num.round(item.value)
  },

  totalItemsTax: (state, getters) => {
    let itemsTax = 0
    getters.splitItems.forEach(item => {
      itemsTax += item.tax * item.quantity
    })
    return itemsTax
  },

  totalModifiersTax: (state, getters) => {
    let modifiersTax = 0
    getters.splitItems.forEach(item => {
      if (item.modifiersData && item.modifiersData.length) {
        modifiersTax += getters.itemModifiersTax(item) * item.quantity
      }
    })
    return modifiersTax
  },

  totalItemTaxDiscount: (state, getters) => {
    let itemTaxDiscount = 0
    getters.splitItems.forEach(item => {
      itemTaxDiscount += getters.itemTaxDiscount(item) * item.quantity
    })
    return itemTaxDiscount
  },

  totalModifierTaxDiscount: (state, getters) => {
    let modifiersTaxDiscount = 0
    getters.splitItems.forEach(item => {
      modifiersTaxDiscount +=
        getters.itemModifierTaxDiscount(item) * item.quantity
    })
    return modifiersTaxDiscount
  },

  totalTax: (state, getters, rootState, rootGetters) => {
    const totalTax = getters.totalTaxWithoutOrderDiscount
    const orderTaxDiscount = rootGetters['discount/taxDiscountAmount']

    return totalTax - orderTaxDiscount
  },
  totalTaxWithoutOrderDiscount: (state, getters, rootState, rootGetters) => {
    const itemsTax = getters.totalItemsTax
    const modifiersTax = getters.totalModifiersTax
    const itemTaxDiscount = getters.totalItemTaxDiscount
    const modifiersTaxDiscount = getters.totalModifierTaxDiscount

    const surchargeTax = rootGetters['surcharge/totalTax']

    return (
      itemsTax -
      itemTaxDiscount +
      modifiersTax -
      modifiersTaxDiscount +
      surchargeTax
    )
  },
  orderTotal: (state, getters, rootState, rootGetters) => {
    let amount =
      getters.subTotal +
      getters.totalTax +
      getters.deliverySurcharge +
      rootGetters['surcharge/surcharge'] -
      rootGetters['discount/orderDiscountWithoutTax']

    if (amount) {
      return Num.round(amount)
    }
    return 0
  },

  itemModifiersPrice: () => item =>
    item.modifiersData && item.modifiersData.length
      ? item.modifiersData.reduce(
          (price, modifier) => price + modifier.price,
          0
        )
      : 0,

  itemModifiersTax: () => item =>
    item.modifiersData && item.modifiersData.length
      ? item.modifiersData.reduce((tax, modifier) => tax + modifier.tax, 0)
      : 0,

  subTotal: (state, getters) => {
    let subTotal = 0
    getters.splitItems.forEach(item => {
      const itemPrice = item.netPrice * item.quantity
      const modifiersPrice = getters.itemModifiersPrice(item) * item.quantity
      const itemDiscount = getters.itemNetDiscount(item) * item.quantity
      const modifiersDiscount =
        getters.itemModifierDiscount(item) * item.quantity
      subTotal += itemPrice + modifiersPrice - itemDiscount - modifiersDiscount
    })

    return subTotal
  },

  itemGrossDiscount: (state, getters) => item => {
    if (item.discountRate) {
      //if value type discount
      if (item.discountType === CONST.VALUE) {
        return getters.itemNetPrice(item) - item.discountedNetPrice
      }

      //percentage or fixed discount, note: fixed is also applied as percentage discount
      return (
        (item.grossPrice * item.discountRate) / 100 +
        getters.itemModifierDiscount(item) +
        getters.itemModifierTaxDiscount(item)
      )
    } else {
      return 0
    }
  },

  itemNetDiscount: (state, getters) => item => {
    if (item.discountRate) {
      //if value type discount
      if (item.discountType === CONST.VALUE) {
        return getters.itemNetPrice(item) - item.discountedNetPrice
      }
      //percentage, fixed discount
      return (item.netPrice * item.discountRate) / 100
    } else {
      return 0
    }
  },

  itemTaxDiscount: (state, getters) => item => {
    //if value type discount
    if (item.discountType === CONST.VALUE) {
      const modifiersTax = getters.itemModifiersTax(item)
      const totalTaxDiscount = item.tax + modifiersTax - item.discountedTax
      return totalTaxDiscount
    }
    //percentage, fixed
    if (item.discountRate) {
      return (item.tax * item.discountRate) / 100
    }
    return 0
  },

  itemModifierDiscount: () => item => {
    if (item.discountType == CONST.FIXED) {
      //no fixed discount for modifiers
      return 0
    }

    //if value type discount, already calculated
    if (item.discountType === CONST.VALUE) {
      return 0
    }

    if (item.discountRate && item.modifiersData && item.modifiersData.length) {
      return item.modifiersData.reduce((discount, modifier) => {
        return discount + (modifier.price * item.discountRate) / 100
      }, 0)
    }
    return 0
  },

  itemModifierTaxDiscount: () => item => {
    if (item.discountType == CONST.FIXED) {
      //no fixed discount for modifiers
      return 0
    }

    if (item.discountRate && item.modifiersData && item.modifiersData.length) {
      //if value type discount, already calculated
      if (item.discountType === CONST.VALUE) {
        return 0
      }
      return item.modifiersData.reduce((discount, modifier) => {
        return discount + (modifier.tax * item.discountRate) / 100
      }, 0)
    }
    return 0
  },

  //ll be called as many times there is a commit on item
  itemGrossPriceDiscounted: (state, getters) => item => {
    if (item.discount && item.discount.type === CONST.VALUE) {
      const itemNetPrice = getters.itemNetPrice(item)
      const itemDiscount = getters.itemGrossDiscount(item)
      return (itemNetPrice - itemDiscount + item.discountedTax) * item.quantity
    } else {
      const itemGrossPrice = getters.itemGrossPrice(item)
      const itemDiscount = getters.itemGrossDiscount(item)
      return itemGrossPrice * item.quantity - itemDiscount * item.quantity
    }
  },

  itemGrossPrice: (state, getters) => item => {
    const itemPrice = item.netPrice
    //gross price is inclusive of tax but modifier price is not including tax
    const modifiersPrice = getters.itemModifiersPrice(item)
    //add modifier tax to modifier price to make it gross price
    const modifiersTax = getters.itemModifiersTax(item)
    return itemPrice + item.tax + modifiersPrice + modifiersTax
  },

  itemNetPrice: (state, getters) => item => {
    const itemPrice = item.netPrice
    //gross price is inclusive of tax but modifier price is not including tax
    const modifiersPrice = getters.itemModifiersPrice(item)
    //add modifier tax to modifier price to make it gross price
    //const modifiersTax = getters.itemModifiersTax(item)
    return itemPrice + modifiersPrice
  },

  orderModifiers: () => item => {
    return item.modifiers.length
  },

  getLatestOnlineOrders: state => {
    if (state.onlineOrders) {
      return state.onlineOrders
    } else {
      if (
        localStorage.getItem('onlineOrders') != 'undefined' &&
        JSON.parse(localStorage.getItem('onlineOrders')) != null
      ) {
        return JSON.parse(localStorage.getItem('onlineOrders'))
      } else {
        return false
      }
    }
  },

  splitItems: state => {
    if (state.splitBill) {
      return state.items.filter(
        item => item.split === true && item.paid === false
      )
    } else {
      return state.items
    }
  },

  items: state => state.items,

  orderType: state => state.orderType.OTApi,
}

// actions
const actions = {
  addNoteToItem({ commit }, note) {
    let item = { ...state.item }
    item.note = note
    //replace item in cart
    commit(mutation.REPLACE_ORDER_ITEM, {
      item: item,
    })
  },
  fetchModificationReasons({ state, commit }) {
    if (!state.modificationReasons.length) {
      OrderService.getModifyReasons().then(response => {
        commit(mutation.SET_MODIFICATION_REASONS, response.data.data)
      })
    }
  },
  setSplitBill({ commit, dispatch }) {
    commit('SET_SPLIT_BILL', -1)
    dispatch('surchargeCalculation')
  },
  splitItems({ commit, dispatch }, items) {
    commit('SPLIT_ITEMS', items)

    dispatch('recalculateItemPrices')
    dispatch('recalculateOrderTotals')
    dispatch('surchargeCalculation')
  },
  markSplitItemsPaid({ commit }) {
    commit(mutation.MARK_SPLIT_ITEMS_PAID)
    return Promise.resolve(1)
  },

  prepareItemTax({ rootState, getters }, { item, type }) {
    return new Promise(resolve => {
      if (type === 'genericOpenItem') {
        //find tax for this item
        item.tax_sum = rootState.tax.openItemTax
        item._id = rootState.tax.openItemId
      }
      //item gross price is inclusive of tax
      item.grossPrice = getters.grossPrice(item)
      //net price is exclusive of tax, netPrice getter ll send unrounded price
      item.netPrice = getters.netPrice(item)

      //calculated item tax, it should be unrounded for precision
      item.tax = item.grossPrice - item.netPrice

      resolve(item)
    })
  },
  prepareItem(
    { commit, getters, rootGetters, rootState, dispatch },
    { item, data }
  ) {
    commit('checkoutForm/RESET', 'process', { root: true })

    return new Promise(resolve => {
      item.split = false
      item.paid = false
      //if generic open item, this comes from footer buttons
      if (data) {
        if (data.type === 'genericOpenItem') {
          item.name = data.name
          item.value = data.value
        } else {
          //this open item comes from backend
          if (item.open_item === true) {
            item.value = data.value
            item.quantity = data.quantity
          }
        }
      }

      if (rootGetters['auth/multistore'] && !item.store_id) {
        item.store_id = rootState.context.storeId
      }

      if (!item.note) {
        item.note = ''
      }

      //Add no only if it is modification order, DON'T add no with new items, it ll break system
      if (item.no) {
        item.orderIndex = item.no
      }

      if (typeof item.orderIndex === 'undefined') {
        item.orderIndex = getters.orderIndex
      }

      if (typeof item.quantity === 'undefined') {
        item.quantity = 1
      }

      dispatch('prepareItemTax', {
        item: item,
        type: data ? data.type : null,
      }).then(item => {
        resolve(item)
      })
    })
  },
  addOpenItem({ dispatch, commit }, { item, data }) {
    return new Promise(resolve => {
      item.modifiable = false
      dispatch('prepareItem', { item, data }).then(item => {
        //this comes directly from the items menu without modifiers
        commit(mutation.ADD_ORDER_ITEM, item)
        dispatch('postCartItem').then(() => resolve())
      })
    })
  },
  addToOrder({ dispatch, commit }, stateItem) {
    let item = { ...stateItem }

    item.modifiable = false
    item.note = stateItem.note ? stateItem.note : ''

    dispatch('prepareItem', { item: item }).then(item => {
      commit(mutation.SET_ITEM, item)
      commit(mutation.ADD_ORDER_ITEM, state.item)
      dispatch('postCartItem')
    })
  },

  postCartItem({ dispatch, commit }) {
    return new Promise(resolve => {
      //reset the modifier form
      commit('orderForm/clearSelection', null, { root: true })
      commit(mutation.SET_TOTAL_ITEMS, state.items.length)
      //if dine in modify then calculate surcharges after every item has been added so
      //it won't clear discounts while validating
      if (!['dine-in-modify'].includes(state.cartType)) {
        dispatch('surchargeCalculation').then(() => resolve())
      } else {
        resolve()
      }
    })
  },
  //this function re-adds an item to order if item is in edit mode, it just replaces exiting item in cart
  addModifierOrder({ commit, rootState, dispatch, rootGetters }, item) {
    return new Promise((resolve, reject) => {
      if (!item) {
        item = { ...rootState.modifier.item }
      }

      item.modifiable = true

      dispatch('prepareItem', { item: item }).then(item => {
        //if there is item modifiers data assign it later
        item.modifiersData = []
        commit(mutation.SET_ITEM, item)

        let itemModifierGroups = []
        let itemModifiers = []

        //adding modifers to item
        if (item.modifiers && !item.editMode) {
          /* ***********************************************/
          /*  ORDER COMING FROM HOLD ORDER                 */
          /* ***********************************************/
          const itemModifiersArray = rootGetters['modifier/itemModifiers'](
            item._id
          )
          //re check if modifiers still available for the item
          if (itemModifiersArray.length) {
            itemModifiersArray.forEach(modifierItem => {
              modifierItem.modifiers.forEach(modifier => {
                if (item.modifiers.includes(modifier._id)) {
                  const subgroup = rootGetters['modifier/getModifierSubgroup'](
                    modifier._id
                  )
                  itemModifiers.push(modifier._id)
                  itemModifierGroups.push({
                    groupId: subgroup._id,
                    itemId: item._id,
                    limit: subgroup.no_of_selection,
                    modifierId: modifier._id,
                    type: subgroup.no_of_selection > 1 ? 'checkbox' : 'radio',
                  })
                }
              })
            })
          }
          //avoid cacthcing again in edit mode
        } else {
          /* ***********************************************/
          /*        New ORDER COMING CATALOG               */
          /* ***********************************************/

          const modifiers = rootGetters['orderForm/modifiers'].filter(
            modifier => modifier.itemId == item._id
          )

          let selectedModifeirGroups = []

          modifiers.forEach(modifier => {
            itemModifierGroups.push(modifier)
            selectedModifeirGroups.push(modifier.groupId)
          })

          //match modifiers with mandatory modifiers for this item, if not matched set error and return false
          const itemMandatoryModifierGroups = rootGetters[
            'modifier/itemMandatoryGroups'
          ](item._id)

          let mandatorySelected = true

          itemMandatoryModifierGroups.forEach(id => {
            if (!selectedModifeirGroups.includes(id)) {
              mandatorySelected = false
            }
          })

          if (mandatorySelected) {
            commit('orderForm/setError', false, {
              root: true,
            })
          } else {
            commit('orderForm/setError', 'Please select at least one item', {
              root: true,
            })
            reject()
            return false
          }

          modifiers.forEach(modifier => {
            if (Array.isArray(modifier.modifierId)) {
              itemModifiers.push(...modifier.modifierId)
            } else {
              itemModifiers.push(modifier.modifierId)
            }
          })
        }

        /*
          itemModifiers
            0:"5cfde3211578dd00215271d1"
            1:"5cfde3211578dd00215271d0"
          itemModifierGroups
            0:
              groupId:"5cfde3211578dd00215271c8"
              itemId:"5cfde31f1578dd0021527183"
              limit:81
              modifierId:"5cfde3211578dd00215271d1"
              type:"checkbox"
        */

        commit(mutation.ADD_MODIFIERS_TO_ITEM, {
          modifiers: itemModifiers,
          modifierGroups: itemModifierGroups,
        })

        //calculating item price based on modifiers selected
        //since we have just ids attached to item,
        //we need to consult modifier store for modifier data ie price

        const modifierSubgroups = rootGetters['modifier/itemModifiers'](
          item._id
        )
        let modifierData = []
        modifierSubgroups.forEach(subgroup => {
          subgroup.modifiers.forEach(modifier => {
            if (item.modifiers.includes(modifier._id)) {
              const modifierPrice = modifier.value
                ? parseFloat(modifier.value)
                : 0
              const tax = (modifierPrice * item.tax_sum) / 100

              let selectedModifierData = {
                modifierId: modifier._id,
                price: modifierPrice,
                tax: tax,
                name: modifier.name,
                type: subgroup.item_type,
              }

              if (item.store_id) {
                selectedModifierData.store_id = item.store_id
              }

              modifierData.push(selectedModifierData)
            }
          })
        })

        commit(mutation.ADD_MODIFIERS_DATA_TO_ITEM, modifierData)

        if (!item.editMode) {
          let quantity = 0
          //coming through hold orders
          if (typeof item.quantity !== 'undefined') {
            quantity = item.quantity
          }
          if (!quantity) {
            quantity = rootState.orderForm.quantity || 1
          }
          commit(mutation.SET_QUANTITY, quantity)
          commit(mutation.ADD_ORDER_ITEM_WITH_MODIFIERS, state.item)
        } else {
          //edit mode
          //if the signature was different then modify modifiers,
          //as we are creating new item and attached modifiers again so its better to just
          //replace that item in state with existing item

          const quantity = rootState.orderForm.quantity || 1
          commit(mutation.SET_QUANTITY, quantity)

          commit(mutation.REPLACE_ORDER_ITEM, {
            item: state.item,
          })
        }

        dispatch('postCartItem').then(() => {
          resolve()
        })
      })
    })
  },

  removeFromOrder({ commit, dispatch }, { item, index }) {
    commit('checkoutForm/RESET', 'process', { root: true })
    commit(mutation.SET_ITEM, item)
    commit(mutation.REMOVE_ORDER_ITEM, index)
    if (state.items.length) {
      commit(mutation.SET_ITEM, state.items[0])
    } else {
      commit(mutation.SET_ITEM, false)
    }

    //remove discounts for this item from state
    commit('discount/REMOVE_ITEM_DISCOUNT', item, { root: true })

    if (state.items.length) {
      dispatch('surchargeCalculation')
    } else {
      //cart is empty remove the discounts
      dispatch('checkout/reset', null, { root: true })
    }
  },

  removeTax({ commit, state, dispatch }) {
    let item = { ...state.item }

    item.tax = 0

    if (item.modifiersData && item.modifiersData.length) {
      item.modifiersData = item.modifiersData.map(modifier => {
        modifier.tax = 0
        return modifier
      })
    }
    //replace item in cart
    commit(mutation.REPLACE_ORDER_ITEM, {
      item: item,
    })

    //going to remove it sooner, used only for discount and surcharge calculation, plan to move it to getters
    dispatch('recalculateItemPrices').then(() => {})
  },
  //index is the new index of an item in cart, if there were 3 items and 1 removed index ll be 0,1
  setActiveItem({ commit, dispatch }, { orderItem }) {
    //get current item
    //this is fired by the items.vue
    let stateItem = state.items.find(
      item => item.orderIndex == orderItem.orderIndex
    )
    let item = { ...stateItem }

    item.editMode = true
    item.quantity = orderItem.quantity
    item.netPrice = orderItem.netPrice
    commit(mutation.SET_ITEM, item)

    // if (item.modifiable) {
    dispatch('orderForm/setItem', { item: item }, { root: true })
    dispatch('discount/setItem', { item: item }, { root: true })
    dispatch(
      'modifier/setActiveItem',
      { item: item },
      {
        root: true,
      }
    )
    // }
  },
  recalculateOrderTotals({
    rootState,
    getters,
    commit,
    rootGetters,
    dispatch,
  }) {
    return new Promise((resolve, reject) => {
      const orderDiscount = rootState.discount.appliedOrderDiscount
      //let totalDiscount = 0
      if (orderDiscount) {
        let orderTotalDiscount = 0
        let taxTotalDiscount = 0
        let surchargeTotalDiscount = 0

        const subtotal = getters.subTotal
        let totalTax = 0
        let totalSurcharge = rootGetters['surcharge/surcharge']
        let totalOrderDiscount = 0

        //this is used for max discount only and only works for percentage, actual discount is
        //calculated below in respective section
        if (orderDiscount.include_surcharge) {
          totalTax = getters.totalTaxWithoutOrderDiscount
          orderTotalDiscount = (subtotal * orderDiscount.rate) / 100
          taxTotalDiscount = (totalTax * orderDiscount.rate) / 100
          surchargeTotalDiscount = (totalSurcharge * orderDiscount.rate) / 100
        } else {
          orderTotalDiscount = (subtotal * orderDiscount.rate) / 100
          totalTax = getters.totalItemsTax
          taxTotalDiscount = (totalTax * orderDiscount.rate) / 100
          surchargeTotalDiscount = 0
        }

        totalOrderDiscount =
          orderTotalDiscount + taxTotalDiscount + surchargeTotalDiscount

        if (orderDiscount.include_surcharge) {
          //apply ontotal discount, apply on surcharge and its tax as well
          totalTax = getters.totalTaxWithoutOrderDiscount

          console.log('total tax, ', totalTax)
          totalSurcharge = rootGetters['surcharge/surcharge']
          console.log('total surcharge', totalSurcharge)
          if (
            orderDiscount.min_cart_value < subtotal &&
            orderDiscount.max_discount_value &&
            orderDiscount.max_discount_value < totalOrderDiscount
          ) {
            orderTotalDiscount = orderDiscount.max_discount_value

            const percentDiscountOnOrderTotalIncludingSurcharge =
              (orderTotalDiscount * 100) / (subtotal + totalSurcharge)

            taxTotalDiscount =
              (totalTax * percentDiscountOnOrderTotalIncludingSurcharge) / 100
            //when calculating percent discount on subtotal we include surcharge as well,
            //so don't need to calculate discount on surcharge again
            surchargeTotalDiscount = 0
            const discountData = {
              orderDiscount: orderTotalDiscount,
              taxDiscount: taxTotalDiscount,
              surchargeDiscount: surchargeTotalDiscount,
            }

            dispatch('discount/setOrderDiscount', discountData, {
              root: true,
            })

            resolve(discountData)
          } else {
            if (orderDiscount.type === CONST.VALUE) {
              if (orderDiscount.value > subtotal) {
                dispatch('discount/clearOrderDiscount', null, { root: true })
                commit(
                  'discount/SET_ORDER_ERROR',
                  CONST.DISCOUNT_ORDER_ERROR_TOTAL,
                  { root: true }
                )
                reject(CONST.DISCOUNT_ORDER_ERROR_TOTAL)
              } else {
                orderTotalDiscount = orderDiscount.value

                const percentDiscountOnOrderTotalIncludingSurcharge =
                  (orderTotalDiscount * 100) / (subtotal + totalSurcharge)

                taxTotalDiscount =
                  (totalTax * percentDiscountOnOrderTotalIncludingSurcharge) /
                  100

                //when calculating percent discount on subtotal we include surcharge as well,
                //so don't need to calculate discount on surcharge again
                surchargeTotalDiscount = 0
                const discountData = {
                  orderDiscount: orderTotalDiscount,
                  taxDiscount: taxTotalDiscount,
                  surchargeDiscount: surchargeTotalDiscount,
                }

                dispatch('discount/setOrderDiscount', discountData, {
                  root: true,
                })

                resolve(discountData)
              }
            } else {
              if (orderDiscount.min_cart_value > subtotal) {
                dispatch('discount/clearOrderDiscount', null, { root: true })
                commit(
                  'discount/SET_ORDER_ERROR',
                  CONST.DISCOUNT_ORDER_ERROR_CART,
                  { root: true }
                )
                const minCartValue = rootGetters['location/formatPrice'](
                  orderDiscount.min_cart_value
                )
                reject(
                  rootGetters['location/_t'](
                    `Minimum cart value should be <strong>${minCartValue}</strong> to apply <strong>${orderDiscount.name}</strong>`
                  )
                )
              } else {
                orderTotalDiscount = (subtotal * orderDiscount.rate) / 100

                console.log('order total discount', orderTotalDiscount)
                taxTotalDiscount = (totalTax * orderDiscount.rate) / 100

                console.log('taxTotalDiscount', taxTotalDiscount)
                surchargeTotalDiscount =
                  (totalSurcharge * orderDiscount.rate) / 100

                console.log('surchargeTotalDiscount', surchargeTotalDiscount)
                const discountData = {
                  orderDiscount: orderTotalDiscount,
                  taxDiscount: taxTotalDiscount,
                  surchargeDiscount: surchargeTotalDiscount,
                }
                console.log('order discount data', discountData)
                dispatch('discount/setOrderDiscount', discountData, {
                  root: true,
                })

                resolve(discountData)
              }
            }
          }
        } else {
          //without surcharge
          //apply offtotal discount, don't calculate discount on surcharge
          //we are not including surcharge tax in total tax for discount
          totalTax = getters.totalItemsTax

          if (
            orderDiscount.min_cart_value < subtotal &&
            orderDiscount.max_discount_value &&
            orderDiscount.max_discount_value < totalOrderDiscount
          ) {
            orderTotalDiscount = orderDiscount.max_discount_value
            const percentDiscountOnSubTotal =
              (orderTotalDiscount * 100) / subtotal

            taxTotalDiscount = (totalTax * percentDiscountOnSubTotal) / 100

            surchargeTotalDiscount = 0

            const discountData = {
              orderDiscount: orderTotalDiscount,
              taxDiscount: taxTotalDiscount,
              surchargeDiscount: surchargeTotalDiscount,
            }
            resolve(discountData)
            dispatch('discount/setOrderDiscount', discountData, {
              root: true,
            })
          } else {
            //const totalSurcharge = rootGetters['surcharge/surcharge']
            if (orderDiscount.type === CONST.VALUE) {
              if (orderDiscount.value > subtotal) {
                dispatch('discount/clearOrderDiscount', null, { root: true })
                commit(
                  'discount/SET_ORDER_ERROR',
                  CONST.DISCOUNT_ORDER_ERROR_TOTAL,
                  { root: true }
                )
                reject(CONST.DISCOUNT_ORDER_ERROR_TOTAL)
              } else {
                const percentDiscountOnSubTotal =
                  (orderDiscount.value * 100) / subtotal
                taxTotalDiscount = (totalTax * percentDiscountOnSubTotal) / 100
                surchargeTotalDiscount = 0

                const discountData = {
                  orderDiscount: orderDiscount.value,
                  taxDiscount: taxTotalDiscount,
                  surchargeDiscount: surchargeTotalDiscount,
                }
                resolve(discountData)
                dispatch('discount/setOrderDiscount', discountData, {
                  root: true,
                })
              }
            } else {
              if (orderDiscount.min_cart_value > subtotal) {
                dispatch('discount/clearOrderDiscount', null, { root: true })
                commit(
                  'discount/SET_ORDER_ERROR',
                  CONST.DISCOUNT_ORDER_ERROR_CART,
                  { root: true }
                )
                const minCartValue = rootGetters['location/formatPrice'](
                  orderDiscount.min_cart_value
                )
                reject(
                  rootGetters['location/_t'](
                    `Minimum cart value should be <strong>${minCartValue}</strong> to apply <strong> ${orderDiscount.name} </strong>`
                  )
                )
              } else {
                orderTotalDiscount = (subtotal * orderDiscount.rate) / 100
                //const subtotalWithDiscount = subtotal - orderTotalDiscount
                totalTax = getters.totalItemsTax
                taxTotalDiscount = (totalTax * orderDiscount.rate) / 100

                surchargeTotalDiscount = 0
                const discountData = {
                  orderDiscount: orderTotalDiscount,
                  taxDiscount: taxTotalDiscount,
                  surchargeDiscount: surchargeTotalDiscount,
                }
                resolve(discountData)
                dispatch('discount/setOrderDiscount', discountData, {
                  root: true,
                })
              }
            }
          }
        }
      } else {
        resolve()
      }
    })
  },

  recalculateItemPrices({ commit, rootState, getters, rootGetters, dispatch }) {
    commit('discount/SET_ORDER_ERROR', false, { root: true })
    return new Promise((resolve, reject) => {
      let discountErrors = {}

      const newItems = state.items.map(stateItem => {
        let item = { ...stateItem }
        const discount = rootState.discount.appliedItemDiscounts.find(
          discount => discount.item.orderIndex == item.orderIndex
        )
        item.cover_no = false

        if (discount) {
          item.discount = {
            id: discount.discount._id,
            name: discount.discount.name,
            type: discount.discount.type,
            rate: discount.discount.rate,
            value: discount.discount.value,
          }

          if (item.store_id) {
            item.discount.store_id = item.store_id
          }

          if (discount.discount.type === CONST.FIXED) {
            if (discount.discount.value >= item.grossPrice) {
              //if discount is equal to or greater than acutal item price
              discountErrors[item.orderIndex] = {
                item: item,
                msg: rootGetters['location/_t'](
                  `Discount is applicable on item price greater than
                  ${rootGetters['location/formatPrice'](
                    discount.discount.value
                  )}`
                ),
              }
              item.discount = false
              item.discountRate = 0
              item.discountedTax = false
              item.discountType = null
              item.discountedNetPrice = false
            } else {
              const priceDiff = item.grossPrice - discount.discount.value
              const discountPercentage = (priceDiff * 100) / item.grossPrice
              item.discountRate = discountPercentage
              item.discountedTax = false
              item.discountedNetPrice = false
              item.discountType = CONST.FIXED
            }
          } else if (discount.discount.type === CONST.VALUE) {
            if (
              discount.discount.value >
              getters.itemNetPrice(item) * item.quantity
            ) {
              //discount error
              discountErrors[item.orderIndex] = item
              item.discount = false
              item.discountRate = 0
              item.discountedTax = false
              item.discountedNetPrice = false
              item.discountType = null
            } else {
              item.discountType = CONST.VALUE
              const itemNetPriceWithModifiers = getters.itemNetPrice(item)

              const itemsNetPriceWithModifiers =
                itemNetPriceWithModifiers * item.quantity
              const itemsDiscountedPrice =
                itemsNetPriceWithModifiers - discount.discount.value

              item.discountedTax =
                (itemsDiscountedPrice * item.tax_sum) / 100 / item.quantity
              item.discountedNetPrice = itemsDiscountedPrice / item.quantity
              item.discountRate = discount.discount.value
            }
          } else {
            //percentage discount can be applied only non free (> 0 priced) items
            if (getters.itemNetPrice(item) * item.quantity > 0) {
              //percentage based discount, use discount.rate here, not discount.value
              //apply discount with modifier price
              item.discountRate = discount.discount.rate

              item.discountedTax = false
              item.discountedNetPrice = false
              item.discountType = CONST.PERCENTAGE
            } else {
              //discount error
              item.discount = false
              discountErrors[item.orderIndex] = item
              item.discountRate = 0
              item.discountedTax = false
              item.discountedNetPrice = false
              item.discountType = null
            }
          }
        } else {
          //remove already applied discount
          item.discount = false
          item.discountRate = 0
          item.discountedTax = false
          item.discountedNetPrice = false
          item.discountType = null
        }
        return item
      })
      // // eslint-disable-next-line no-console
      // console.log(itemsDiscount)
      // dispatch(
      //   'discount/setItemsDiscountAmount',
      //   { discountAmount: itemsDiscount },
      //   { root: true }
      // )

      commit(mutation.RE_SAVE_ITEMS, newItems)
      dispatch('surcharge/calculate', {}, { root: true })

      if (
        Object.entries(discountErrors).length > 0 &&
        discountErrors.constructor === Object
      ) {
        reject(discountErrors)
        dispatch('discount/clearItemDiscount', discountErrors, { root: true })
      } else {
        resolve()
      }
    })
  },

  updateQuantity({ commit, dispatch }, quantity) {
    const itemQuantity = quantity || 1
    commit(mutation.UPDATE_ITEM_QUANTITY, itemQuantity)
    dispatch('surchargeCalculation')
  },

  surchargeCalculation({ rootState, dispatch }) {
    return new Promise(resolve => {
      dispatch('surcharge/calculate', {}, { root: true })
        .then(() => {
          if (rootState.discount.appliedOrderDiscount) {
            dispatch('recalculateOrderTotals')
          } else {
            dispatch('recalculateItemPrices')
          }
          resolve()
        })
        .catch(error => {
          console.log(error)
        })
    })
  },

  reset({ commit }) {
    commit(mutation.RESET)
  },
  addOrderNote({ commit }, orderNote) {
    commit(mutation.SET_ORDER_NOTE, orderNote)
  },

  setOnlineOrders({ commit, rootState }, onlineOrderData) {
    // const params = [1, onlineOrderData.location_id]
    let orderDetail = ''
    // OrderService.fetchOnlineOrderDetails(...params).then(response => {
    //   orderDetail = response.data.orderDetails
    commit(mutation.ONLINE_ORDERS, {
      onlineOrders: onlineOrderData,
      locationId: rootState.location.location,
      orderDetails: orderDetail,
    })
    // })
  },

  /*getPastOrderDetails({ commit, rootState }, orderId) {
    const params = [orderId, rootState.location.location]
    OrderService.fetchOnlineOrderDetails(...params).then(response => {
      commit(mutation.PAST_ORDER_DETAILS, response.data.orderDetails)
    })
  },*/

  deliveryOrder({ commit, dispatch }, { referral, futureOrder }) {
    return new Promise((resolve, reject) => {
      commit(mutation.ORDER_TYPE, { OTview: 'Delivery', OTApi: 'call_center' })
      commit(mutation.SET_REFERRAL, referral)
      if (futureOrder != null) {
        commit(mutation.SET_FUTURE_ORDER, futureOrder)
      }
      dispatch('checkout/pay', {}, { root: true })
        .then(response => resolve(response))
        .catch(response => reject(response))
    })
  },

  updateOrderType({ commit, dispatch }, orderType) {
    commit(mutation.ORDER_TYPE, orderType)
    return dispatch('surchargeCalculation')
  },
  //prepare dine in order modification
  prepareModifyDineinOrder({ commit, dispatch, rootState }, order) {
    return new Promise((resolve, reject) => {
      dispatch('dinein/getDineInTables', null, { root: true })
      dispatch('dinein/getCovers', null, { root: true }).then(() => {
        const tableReservationId = order.table_reservation_id
        if (rootState.dinein.tables && order.assigned_table_id) {
          const tableData = rootState.dinein.tables.find(
            table => table._id === order.assigned_table_id
          )
          if (tableData) {
            commit('dinein/SELECTED_TABLE', tableData, { root: true })
          }
        }
        commit('dinein/RESERVATION_ID', tableReservationId, { root: true })
        commit('dinein/ORDER_RESERVATION_DATA', order, { root: true })
        dispatch('dinein/getSelectedOrder', order._id, {
          root: true,
        })
          .then(data => resolve(data))
          .catch(error => reject(error))
      })
    })
  },
  //modify order from backend or transaction screen
  modifyOrder({ commit, dispatch }, orderId) {
    commit(mutation.ORDER_TO_MODIFY, orderId)
    dispatch('startOrder')

    const params = ['orders', orderId, '']
    OrderService.getGlobalDetails(...params).then(async response => {
      let orderDetails = {}
      let promises = []

      orderDetails.item = response.data.item
      orderDetails.customer = response.data.collected_data.customer
      orderDetails.lookups = response.data.collected_data.page_lookups
      orderDetails.store_name = response.data.collected_data.store_name
      orderDetails.invoice =
        response.data.collected_data.store_invoice_templates
      commit(mutation.SET_ORDER_DETAILS, orderDetails)

      switch (response.data.item.order_type) {
        case 'dine_in':
          commit(mutation.ORDER_TYPE, { OTview: 'Dine In', OTApi: 'dine_in' })
          promises.push(
            dispatch('prepareModifyDineinOrder', response.data.item)
          )
          break
        case 'walk_in':
          commit(mutation.ORDER_TYPE, { OTview: 'Walk In', OTApi: 'walk_in' })
          promises.push(Promise.resolve())
          break
        case 'takeaway':
          commit(mutation.ORDER_TYPE, {
            OTview: 'Take Away',
            OTApi: 'takeaway',
          })
          promises.push(Promise.resolve())
          break
        case 'call_center':
          commit(mutation.ORDER_TYPE, {
            OTview: 'Delivery',
            OTApi: 'call_center',
          })
          promises.push(Promise.resolve())
          break
        case 'carhop':
          commit(mutation.ORDER_TYPE, {
            OTview: 'Carhop',
            OTApi: 'carhop',
          })
          promises.push(Promise.resolve())
          break
      }
      await Promise.all(promises)
      dispatch('setDiscounts', orderDetails).then(() => {
        dispatch('addOrderToCart', orderDetails.item)
      })
    })
  },
  //from hold order, there would be a single order with multiple items so need to clear what we have already in cart
  async addOrderToCart({ rootState, commit, dispatch }, order) {
    //create cart items indexes so we can sort them when needed
    return new Promise(async resolve => {
      dispatch('reset')
      commit(mutation.SET_ORDER_ID, order._id)
      dispatch('startOrder')

      commit(mutation.SET_TOTAL_ITEMS, order.items.length)
      commit(mutation.SET_TOTAL_ITEMS_PAID, 0)

      let orderAddress = []

      if (order.customer) {
        let deliveryAreaDetails = Object.values(
          rootState.order.selectedOrder.lookups.delivery_areas._id
        ).find(deliveryArea => deliveryArea._id === order.order_delivery_area)

        orderAddress.push({
          building: order.order_building,
          city: order.order_city,
          country: order.order_country,
          created_at: order.created_at,
          delivery_area: deliveryAreaDetails.name,
          delivery_area_id: order.order_delivery_area,
          flat_number: order.order_flat_number,
          nearest_landmark: order.order_nearest_landmark,
          store_id: order.store_id,
          street: order.order_street,
          _id: order._id,
        })
        dispatch('customer/fetchSelectedCustomer', order.customer, {
          root: true,
        })
        if (orderAddress.length) {
          dispatch('customer/selectedAddress', orderAddress, {
            root: true,
          })
          commit('location/SET_MODAL', '#order-confirmation', {
            root: true,
          })
        }
        // commit('location/SET_MODAL', '#order-confirmation')
      }
      let orderData = {
        _id: order._id,
        order_no: order.order_no,
        customer: order.customer,
      }
      commit(mutation.SET_ORDER_DATA, orderData)

      let allCovers = rootState.dinein.covers
      let promises = []
      order.items.forEach((orderItem, key) => {
        rootState.category.items.forEach(categoryItem => {
          let item = { ...categoryItem }
          item.no = orderItem.no
          item.note = orderItem.note
          if (
            state.selectedOrder &&
            state.selectedOrder.item.order_type === 'dine_in'
          ) {
            let coverNo = state.selectedOrder.item.items.filter(
              data => data.entity_id === item._id
            )
            if (coverNo.length) {
              item.coverNo = coverNo[0].cover_no
              if (allCovers !== false && item.coverNo !== '') {
                let coverDetail = allCovers.filter(
                  cover => cover._id === item.coverNo
                )
                item.cover_name =
                  coverDetail.length > 0 ? coverDetail[0].name : ''
              }
            }
          }
          if (orderItem.entity_id === categoryItem._id) {
            item.quantity = orderItem.qty
            let modifiers = []
            if (order.item_modifiers.length) {
              order.item_modifiers.forEach(modifier => {
                if (modifier.for_item === key) {
                  modifiers.push(modifier.entity_id)
                }
              })
            }
            if (typeof orderItem.kitchen_invoice !== 'undefined') {
              item['kitchen_invoice'] = orderItem.kitchen_invoice
            }

            //add store id if it was there
            if (orderItem.store_id) {
              item['store_id'] = orderItem.store_id
            }

            if (modifiers.length) {
              item.modifiers = modifiers
              dispatch('modifier/assignModifiersToItem', item, {
                root: true,
              }).then(() => {
                promises.push(dispatch('addModifierOrder', item))
              })
            } else {
              promises.push(dispatch('addToOrder', item))
            }
          }
        })
      })

      await Promise.all(promises)
      commit(mutation.REINDEX_ITEMS)
      //if modifying from dine in then calculate totals once every order has been added, it ll be when all have been resolved
      resolve()
    })
  },

  addHoldOrder({ dispatch, commit }, order) {
    dispatch('addOrderToCart', order).then(() => {
      commit(mutation.ORDER_STATUS, CONST.ORDER_STATUS_ON_HOLD)
    })
  },

  loadCarhopOrder({ commit, dispatch }, orderId) {
    if (state.orderType.OTview == 'Carhop') {
      commit(mutation.ORDER_TYPE, {
        OTview: 'Carhop',
        OTApi: CONST.ORDER_TYPE_CARHOP,
      })
    }
    commit(mutation.SET_ORDER_ID, orderId)

    dispatch('startOrder')

    const params = ['orders', orderId, '']
    OrderService.getGlobalDetails(...params).then(response => {
      let orderDetails = {}

      orderDetails.item = response.data.item
      orderDetails.customer = response.data.collected_data.customer
      orderDetails.lookups = response.data.collected_data.page_lookups
      orderDetails.store_name = response.data.collected_data.store_name
      orderDetails.invoice =
        response.data.collected_data.store_invoice_templates
      commit(mutation.SET_ORDER_DETAILS, orderDetails)

      dispatch('setDiscounts', orderDetails).then(() => {
        dispatch('addOrderToCart', orderDetails.item).then(() => {})
      })
    })
  },

  addDeliveryOrder({ dispatch, commit }, orderData) {
    dispatch('addOrderToCart', orderData.item).then(() => {
      commit(mutation.ORDER_STATUS, CONST.ORDER_STATUS_IN_DELIVERY)
      if (!state.orderType.OTApi) {
        commit(mutation.ORDER_TYPE, {
          OTview: 'Delivery',
          OTApi: 'call_center',
        })
      }
    })
  },

  modifyOrderTransaction({ rootState, dispatch, commit }) {
    let orderData = rootState.order.selectedOrder.item
    let orderType = orderData.order_type
    dispatch('addOrderToCart', orderData).then(() => {
      if (orderType === 'dine_in') {
        commit(mutation.ORDER_STATUS, CONST.ORDER_STATUS_IN_PROGRESS)
        commit(mutation.ORDER_TYPE, { OTview: 'Dine In', OTApi: 'dine_in' })
      } else if (orderType === 'walk_in') {
        commit(mutation.ORDER_STATUS, CONST.ORDER_STATUS_IN_PROGRESS)
        commit(mutation.ORDER_TYPE, { OTview: 'Walk In', OTApi: 'walk_in' })
      } else if (orderType === 'carhop') {
        commit(mutation.ORDER_STATUS, CONST.ORDER_STATUS_IN_PROGRESS)
        commit(mutation.ORDER_TYPE, { OTview: 'Carhop', OTApi: 'carhop' })
      } else if (orderType === 'takeaway') {
        commit(mutation.ORDER_STATUS, CONST.ORDER_STATUS_IN_PROGRESS)
        commit(mutation.ORDER_TYPE, { OTview: 'Take Away', OTApi: 'takeaway' })
      } else {
        commit(mutation.ORDER_STATUS, CONST.ORDER_STATUS_IN_DELIVERY)
        commit(mutation.ORDER_TYPE, {
          OTview: 'Delivery',
          OTApi: 'call_center',
        })
      }
    })
    return orderData
  },
  setDiscounts({ rootGetters, commit }, orderData) {
    return new Promise(resolve => {
      //set discounts here
      let discount = null
      if (
        orderData.item.order_discounts &&
        orderData.item.order_discounts.length
      ) {
        orderData.item.order_discounts.forEach(orderDiscount => {
          discount = rootGetters['discount/orderDiscount'](
            orderDiscount.entity_id
          )
          if (discount) {
            commit('discount/SET_ACTIVE_ORDER_DISCOUNT', discount, {
              root: true,
            })
            commit('discount/APPLY_ORDER_DISCOUNT', discount, { root: true })
          }
        })
      }
      if (
        orderData.item.item_discounts &&
        orderData.item.item_discounts.length
      ) {
        let item = {}
        let orderItem = {}
        orderData.item.item_discounts.forEach(itemDiscount => {
          orderItem = orderData.item.items[itemDiscount.for_item]
          item = {
            orderIndex: itemDiscount.for_item,
            _id: orderItem.entity_id,
          }
          commit(mutation.SET_ITEM, item)
          discount = rootGetters['discount/itemDiscount'](
            itemDiscount.entity_id
          )
          if (discount) {
            commit(
              'discount/APPLY_ITEM_DISCOUNT',
              { item: item, discount: discount },
              { root: true }
            )
          }
        })
      }
      resolve()
    })
  },
  addDiningOrder({ dispatch, commit }, orderData) {
    return new Promise((resolve, reject) => {
      commit('SET_CART_TYPE', 'dine-in-modify')
      dispatch('setDiscounts', orderData)
        .then(() => {
          dispatch('addOrderToCart', orderData.item)
            .then(() => {
              commit('checkout/SPLIT_PAID', false, { root: true })
              commit(mutation.SET_SPLIT_BILL, false)
              commit(mutation.SET_SPLITTED, false)
              dispatch('surchargeCalculation')
              resolve()
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
    })
  },
  selectedOrderDetails({ commit }, orderId) {
    return new Promise((resolve, reject) => {
      const params = ['orders', orderId, '']
      OrderService.getGlobalDetails(...params)
        .then(response => {
          let orderDetails = {}
          orderDetails.item = response.data.item
          let collectedData = response.data.collected_data
          orderDetails.customer = collectedData.customer
          orderDetails.lookups = collectedData.page_lookups
          orderDetails.store_name = collectedData.store_name
          orderDetails.invoice = collectedData.store_invoice_templates
          //Check if there is a table number in order details
          if (typeof collectedData.table_number != 'undefined') {
            orderDetails.table_number = collectedData.table_number
          }

          commit(mutation.SET_ORDER_DETAILS, orderDetails)

          OrderService.getModalDetails('brand_cancellation_reasons')
            .then(responseData => {
              commit(mutation.SET_CANCELLATION_REASON, responseData.data.data)
            })
            .catch(error => reject(error))

          resolve(orderDetails)
        })
        .catch(error => reject(error))
    })
  },
  removeOrder({ dispatch }, { order, orderType }) {
    let actionTrigger = orderType
    if (actionTrigger) {
      actionTrigger = 'delete_' + actionTrigger
    } else {
      actionTrigger = 'delete'
    }
    dispatch('updateOrderAction', { order, orderType, actionTrigger })
  },

  updateOrderAction(
    { dispatch, state, commit },
    { order, orderType, actionTrigger }
  ) {
    if (state.processing) {
      return false
    }

    commit('SET_PROCESSING', true)
    if (actionTrigger === 'addToDriverBucket') {
      dispatch('deliveryManager/addOrderToDriverBucket', order, {
        root: true,
      })
        .then(() => {})
        .catch(() => {})
        .finally(() => commit('SET_PROCESSING', false))
    } else {
      let data = { driver: state.selectedDriver }

      OrderService.updateOrderAction(order._id, actionTrigger, data)
        .then(response => {
          if (response.status == 200) {
            switch (orderType) {
              case 'hold':
                dispatch('holdOrders/remove', order, { root: true })
                break
              case 'call_center':
              case 'takeaway':
                dispatch(
                  'deliveryManager/fetchDMOrderDetail',
                  {},
                  { root: true }
                )
                break
            }
          }
        })
        .finally(() => commit('SET_PROCESSING', false))
    }
  },
  updateOrderCancelAction(
    { dispatch, commit },
    { order, orderType, actionTrigger, params }
  ) {
    return new Promise((resolve, reject) => {
      OrderService.updateOrderAction(order.order._id, actionTrigger, params)
        .then(
          response => {
            if (response.status == 200) {
              switch (orderType) {
                case 'hold':
                  dispatch('holdOrders/remove', order, { root: true })
                  break
                case 'call_center':
                  commit(mutation.SET_ERRORS, response.data.form_errors)
                  dispatch(
                    'deliveryManager/fetchDMOrderDetail',
                    {},
                    { root: true }
                  )
                  break
              }
            }
            resolve(response)
          },
          errors => {
            reject(errors.data.error)
          }
        )
        .catch(response => {
          reject(response.data.form_errors)
        })
    })
  },
  beforeRedirectResetCartDineIn({ dispatch, rootState }) {
    let dineInAreas = rootState.order.areas
    if (typeof dineInAreas != 'undefined') {
      dispatch('dinein/selectedArea', dineInAreas[0], {
        root: true,
      })
    }
    dispatch('dinein/getDineInOrders', {}, { root: true })
    //Empty Local Storage
    localStorage.setItem('reservation', false)
    localStorage.setItem('reservationId', false)
  },
  startOrder({ commit }) {
    commit(mutation.START_ORDER)
    commit('checkout/SET_PROCESSING', false, { root: true })
  },
}

function playSound(locationId, onlineOrders) {
  let nopromise = {
    catch: new Function(),
  }
  // onlineOrders.orders.forEach(order => {
  if (locationId == onlineOrders.location_id) {
    let onlineNewOrderAudioRing = new Audio(
      'https://int.erp-pos.com/sound/doorbell.ogg'
    )
    onlineNewOrderAudioRing.load()
    if (onlineOrders.orders && onlineOrders.orders.length) {
      onlineNewOrderAudioRing.addEventListener(
        'ended',
        function() {
          this.currentTime = 0
          ;(this.play() || nopromise).catch(function() {})
        },
        false
      )
      ;(onlineNewOrderAudioRing.play() || nopromise).catch(function() {})
    } else {
      onlineNewOrderAudioRing.pause()
      onlineNewOrderAudioRing.currentTime = 0
    }
  }
}

// mutations
const mutations = {
  [mutation.SET_ITEM](state, item) {
    state.item = item
  },
  [mutation.SET_ERRORS](state, item) {
    state.errors = item
  },

  [mutation.ADD_ORDER_ITEM](state, item) {
    item.modifiers = []
    state.items.push(item)
    // if (item.orderIndex > state.items.length) {
    //   for (let i = state.items.length; i < item.orderIndex; i++) {
    //     state.items.push({})
    //   }
    // }
    // state.items.splice(item.orderIndex, 0, item)
  },

  [mutation.ADD_ORDER_ITEM_WITH_MODIFIERS](state, item) {
    // if (item.orderIndex > state.items.length) {
    //   for (let i = state.items.length; i < item.orderIndex; i++) {
    //     state.items.push({})
    //   }
    // }
    // state.items.splice(item.orderIndex, 0, item)
    state.items.push(item)
  },

  [mutation.INCREMENT_ORDER_ITEM_QUANTITY](state, index) {
    //need to use array splice to make it reactive
    state.items = state.items.map(item => {
      if (item.orderIndex == index) {
        item.quantity++
      }
      return item
    })
  },

  [mutation.REMOVE_ORDER_ITEM](state, index) {
    state.items = state.items.filter(function(orderItem, key) {
      return key != index
    })
  },

  [mutation.REPLACE_ORDER_ITEM](state, { item }) {
    state.items = state.items.map(stateItem => {
      if (stateItem.orderIndex == item.orderIndex) {
        return item
      }
      return stateItem
    })
  },

  [mutation.ADD_MODIFIERS_TO_ITEM](state, { modifiers, modifierGroups }) {
    state.item.modifiers = modifiers
    state.item.modifierGroups = modifierGroups
  },

  [mutation.ADD_MODIFIERS_DATA_TO_ITEM](state, modifiers) {
    state.item.modifiersData = modifiers
  },

  [mutation.SET_ITEM_TAX](state, tax) {
    state.item.tax = tax
  },

  [mutation.RE_SAVE_ITEMS](state, items) {
    state.items = items
  },

  [mutation.SET_QUANTITY](state, qty) {
    state.item.quantity = qty
  },

  [mutation.UPDATE_ITEM_QUANTITY](state, quantity) {
    const index = state.item.orderIndex
    state.item.quantity = quantity

    state.items = state.items.map(item => {
      if (item.orderIndex == index) {
        item.quantity = quantity
      }
      return item
    })
  },
  [mutation.UPDATE_ITEMS](state, items) {
    state.items = items
  },
  [mutation.REINDEX_ITEMS](state) {
    //reset items according to their order no, THIS IS DONE when some of orders are paid and again added to cart
    const newItems = []
    state.items.map(item => {
      item.orderIndex = item.no
      newItems[item.no] = item
    })
    //remove deleted items
    const filteredItems = newItems.filter(item => {
      if (typeof item !== 'undefined' && item._id) {
        return true
      }
      return false
    })
    state.items = filteredItems
  },
  CLEAR_SELECTED_ORDER(state) {
    state.orderSource = null
    state.selectedOrder = false
  },
  [mutation.RESET](state, full = true) {
    if (full) {
      state.items = []
      state.orderStatus = null
      state.orderNote = null
    }

    state.splittedItems = {}
    state.item = false
    state.orderId = null
    state.orderData = null
    //reset order souce when order is completed
  },
  [mutation.SET_ORDER_NOTE](state, orderNote) {
    state.orderNote = orderNote
  },
  [mutation.ORDER_TYPE](state, orderType) {
    // state.orderType = orderType.charAt(0).toUpperCase() + orderType.slice(1)
    state.orderType = orderType
  },
  [mutation.SET_REFERRAL](state, referral) {
    state.referral = referral
  },
  [mutation.SET_FUTURE_ORDER](state, futureOrder) {
    state.futureOrder = futureOrder
  },
  [mutation.SET_ORDER_ID](state, id) {
    state.orderId = id
  },
  [mutation.SET_ORDER_DATA](state, data) {
    state.orderData = data
  },
  [mutation.ONLINE_ORDERS](state, { onlineOrders, locationId, orderDetails }) {
    localStorage.setItem('onlineOrders', JSON.stringify(orderDetails))
    state.onlineOrders = orderDetails
    playSound(locationId, onlineOrders)
  },
  [mutation.SET_ORDER_DETAILS](state, selectedOrderDetails) {
    state.selectedOrder = selectedOrderDetails
  },
  [mutation.SET_CANCELLATION_REASON](state, cancelationReason) {
    state.cancellationReason = cancelationReason
  },
  [mutation.ORDER_STATUS](state, status) {
    state.orderStatus = status
  },

  [mutation.SET_CART_TYPE](state, cartType) {
    state.cartType = cartType
  },
  [mutation.IS_PAY](state, val) {
    state.is_pay = val
  },

  [mutation.START_ORDER](state) {
    state.startTime = DateTime.getUTCDateTime()
  },

  [mutation.SET_TOTAL_ITEMS](state, count) {
    state.totalItems = count
  },

  [mutation.SET_MODIFICATION_REASONS](state, reasons) {
    state.modificationReasons = reasons
  },

  [mutation.SET_TOTAL_ITEMS_PAID](state, count) {
    state.totalItemsPaid = count
  },

  [mutation.RESET_ORDER_TIME](state) {
    state.startTime = null
  },

  [mutation.SET_SPLITTED](state, status) {
    state.splitted = status
  },

  [mutation.ORDER_TO_MODIFY](state, orderId) {
    state.orderToModify = orderId
  },
  [mutation.ORDER_SOURCE](state, source) {
    state.orderSource = source
  },
  [mutation.SET_SPLIT_BILL](state, status = -1) {
    //if -1 then toggle it, if true assign true, if false assign false, if null then assign null
    if (status === -1) {
      state.splitBill = state.splitBill ? false : true
    } else {
      state.splitBill = status
    }
    if (state.splitBill) {
      state.splitted = true
    } else {
      state.splitted = false
    }
  },
  [mutation.RESET_SPLIT_BILL](state) {
    state.splitBill = false
    state.splitted = false
  },
  [mutation.MARK_SPLIT_ITEMS_PAID](state) {
    const newitems = state.items.map(item => {
      if (Object.keys(state.splittedItems).length) {
        if (state.splittedItems[item.orderIndex] === true) {
          item.paid = true
        } else {
          item.paid = false
        }
      } else {
        item.paid = true
      }
      return item
    })
    state.items = newitems
  },
  [mutation.SPLIT_ITEMS](state, items) {
    state.splittedItems = items
    //remove item / order discounts
    //remove tax and surcharges
    //problem here
    const newitems = state.items.map(item => {
      if (state.splittedItems[item.orderIndex] === true) {
        item.split = true
      } else {
        item.split = false
      }
      return item
    })
    state.items = newitems
  },
  SET_PROCESSING(state, status) {
    state.processing = status
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
