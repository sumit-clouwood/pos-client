import * as mutation from './tax/mutation-types'
// initial state
const state = {
  itemsTax: 0,
  itemsTaxData: [],
  modifiersTaxData: [],
  surchargeTax: 0,
}

// getters
const getters = {
  totalTax: (state, getters, rootState) =>
    state.itemsTax + state.surchargeTax - rootState.discount.taxDiscountAmount,
  modifierTaxData: state => ({ modifierId, itemId }) => {
    return state.modifiersTaxData.find(
      modifier =>
        modifier.itemId === itemId && modifier.modifierId === modifierId
    )
  },
  itemModifiersTaxData: state => itemId => {
    return state.modifiersTaxData.filter(modifier => modifier.itemId === itemId)
  },
}

// actions
const actions = {
  calculate({ commit, rootState }) {
    return new Promise(resolve => {
      if (rootState.order.items.length) {
        let itemTaxData = []
        let itemsTax = rootState.order.items.reduce((totalTax, item) => {
          //calculate tax here
          //item.price is now price before tax and discount applied, so need to recalculate the tax
          if (item.tax_sum) {
            itemTaxData.push({
              quantity: item.quantity,
              itemId: item._id,
              tax: item.grossPrice - item.netPrice,
              undiscountedTax:
                item.undiscountedGrossPrice - item.undiscountedNetPrice,
            })
            return totalTax + (item.grossPrice - item.netPrice) * item.quantity
          } else {
            return totalTax
          }
        }, 0)

        commit(mutation.SET_ITEMS_TAX, itemsTax)
        commit(mutation.SET_ITEMS_TAX_DATA, itemTaxData)

        //apply tax on surcharge that is calculated earlier
        if (rootState.surcharge.surchargeAmounts) {
          const surchargeTax = rootState.surcharge.surchargeAmounts.reduce(
            (totalTax, surcharge) => {
              return totalTax + surcharge.tax
            },
            0
          )

          commit(mutation.SET_SURCHARGE_TAX, surchargeTax)
        } else {
          commit(mutation.SET_SURCHARGE_TAX, 0)
        }
      }
      resolve()
    })
  },
  reset({ commit }) {
    commit(mutation.RESET)
  },

  setModifierTaxData({ commit }, modifiersTaxData) {
    commit(mutation.SET_MODIFIERS_TAX_DATA, modifiersTaxData)
  },
}

// mutations
const mutations = {
  [mutation.SET_ITEMS_TAX](state, tax) {
    state.itemsTax = !isNaN(tax) ? tax : 0
  },
  [mutation.SET_ITEMS_TAX_DATA](state, taxData) {
    state.itemsTaxData = taxData
  },
  [mutation.SET_SURCHARGE_TAX](state, tax) {
    state.surchargeTax = tax
  },
  [mutation.SET_MODIFIERS_TAX_DATA](state, modifiersTaxData) {
    state.modifiersTaxData = modifiersTaxData
  },
  [mutation.RESET](state) {
    state.itemsTax = 0
    state.itemsTaxData = []
    state.surchargeTax = 0
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
