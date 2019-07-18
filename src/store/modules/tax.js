import * as mutation from './tax/mutation-types'
import Num from '@/plugins/helpers/Num.js'

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
      total += item.quantity * Num.round(item.tax)
      total += item.quantity * Num.round(item.modifiersTax)
    })
    return total
  },

  // modifiersTax: state => index => {
  //   return state.modifiersTaxData[index].reduce((total, tax) => {
  //     return total + Num.round(tax.tax)
  //   }, 0)
  // },

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
  calculate({ commit, rootState }) {
    return new Promise(resolve => {
      if (rootState.order.items.length) {
        let itemTaxData = []
        rootState.order.items.forEach(item => {
          //calculate tax here
          //item.price is now price before tax and discount applied, so need to recalculate the tax
          if (item.tax_sum) {
            itemTaxData.push({
              quantity: item.quantity,
              orderIndex: item.orderIndex,
              tax:
                item.grossPriceWithoutModifiers - item.netPriceWithoutModifiers,
              undiscountedTax:
                item.undiscountedGrossPriceWithoutModifiers -
                item.undiscountedNetPriceWithoutModifiers,

              //discounted and undiscounted tax with modifiers
              taxWithModifiers: item.grossPrice - item.netPrice,
              undiscountedTaxWithModifiers:
                item.undiscountedGrossPrice - item.undiscountedNetPrice,

              modifiersTax:
                item.grossPrice -
                item.netPrice -
                (item.grossPriceWithoutModifiers -
                  item.netPriceWithoutModifiers),
              undiscountedModifiersTax:
                item.undiscountedGrossPrice -
                item.undiscountedNetPrice -
                (item.undiscountedGrossPriceWithoutModifiers -
                  item.undiscountedNetPriceWithoutModifiers),
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
