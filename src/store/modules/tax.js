import * as mutation from './tax/mutation-types'
import Num from '@/plugins/helpers/Num.js'
import * as CONST from '@/constants'

// initial state
const state = {
  itemsTaxData: [],
  surchargeTaxData: [],
  modifiersTaxData: {},
}

// getters
const getters = {
  itemsTax: state => {
    let total = 0
    state.itemsTaxData.forEach(item => {
      total += item.tax * item.quantity + item.modifiersTax * item.quantity
    })
    return Num.round(total)
  },

  surchargeTax: state => {
    return state.surchargeTaxData.reduce((total, tax) => {
      return total + Num.round(tax)
    }, 0)
  },

  totalTax: (state, getters, rootState, rootGetters) => {
    return (
      getters.itemsTax +
      getters.surchargeTax -
      rootGetters['discount/taxDiscountAmount']
    )
  },

  modifierTaxData: state => ({ modifierId, orderIndex }) => {
    const modifiers = state.modifiersTaxData[orderIndex]
    return modifiers.find(modifier => modifier.modifierId === modifierId)
  },
  itemModifiersTaxData: state => orderIndex => {
    return state.modifiersTaxData[orderIndex]
  },
}

// actions
const actions = {
  //as soon as discount is applied (item level), this function is called immediatley after that
  //that means we have now discounted prices for an item
  calculate({ commit, rootState }) {
    return new Promise(resolve => {
      if (rootState.order.items.length) {
        let itemTaxData = []
        rootState.order.items.forEach(item => {
          //calculate tax here
          //item.price is now price before tax and discount applied, so need to recalculate the tax
          if (item.tax_sum) {
            const taxWithoutModifiers =
              item.grossPriceWithoutModifiers - item.netPriceWithoutModifiers

            const undiscountedTaxWithoutModifiers =
              item.undiscountedGrossPriceWithoutModifiers -
              item.undiscountedNetPriceWithoutModifiers

            //discounted and undiscounted tax with modifiers
            const undiscountedTaxWithModifiers =
              Num.round(item.undiscountedGrossPrice) -
              Num.round(item.undiscountedNetPrice)

            const undiscountedModifiersTax =
              Num.round(undiscountedTaxWithModifiers) -
              Num.round(undiscountedTaxWithoutModifiers)

            let modifiersTax = undiscountedModifiersTax

            //apply discount on modifiers tax by getting item discount
            if (item.discount) {
              if (item.discount.type === CONST.VALUE) {
                //do something here
              } else {
                modifiersTax =
                  Num.round(undiscountedModifiersTax) -
                  (Num.round(undiscountedModifiersTax) * item.discount.rate) /
                    100
              }
            }
            const taxWithModifiers = modifiersTax + taxWithoutModifiers

            itemTaxData.push({
              quantity: item.quantity,
              orderIndex: item.orderIndex,

              tax: Num.round(taxWithoutModifiers),
              undiscountedTax: Num.round(undiscountedTaxWithoutModifiers),

              //discounted and undiscounted tax with modifiers
              taxWithModifiers: Num.round(taxWithModifiers),
              undiscountedTaxWithModifiers: Num.round(
                undiscountedTaxWithModifiers
              ),

              modifiersTax: Num.round(modifiersTax),
              undiscountedModifiersTax: Num.round(undiscountedModifiersTax),
            })
          }
        })
        commit(mutation.SET_ITEMS_TAX_DATA, itemTaxData)

        //apply tax on surcharge that is calculated earlier
        let surchargeTaxData = []
        if (rootState.surcharge.surchargeAmounts) {
          rootState.surcharge.surchargeAmounts.forEach(surcharge => {
            surchargeTaxData.push(surcharge.tax)
          })

          commit(mutation.SET_SURCHARGE_TAX_DATA, surchargeTaxData)
        }
      }
      resolve()
    })
  },

  reset({ commit }) {
    commit(mutation.RESET)
  },

  setModifierTaxData({ commit }, { orderIndex, modifiersTaxData }) {
    commit(mutation.SET_MODIFIERS_TAX_DATA, {
      orderIndex: orderIndex,
      modifiersTaxData: modifiersTaxData,
    })
  },
}

// mutations
const mutations = {
  [mutation.SET_ITEMS_TAX_DATA](state, taxData) {
    state.itemsTaxData = taxData
  },
  [mutation.SET_SURCHARGE_TAX_DATA](state, data) {
    state.surchargeTaxData = data
  },
  [mutation.SET_MODIFIERS_TAX_DATA](state, { orderIndex, modifiersTaxData }) {
    //Vue.set(modifiersTaxData, orderIndex, modifiersTaxData)
    let obj = { ...state.modifiersTaxData }
    obj[orderIndex] = modifiersTaxData
    state.modifiersTaxData = obj
  },
  [mutation.RESET](state) {
    state.itemsTaxData = []
    state.surchargeTaxData = []
    state.modifiersTaxData = []
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
