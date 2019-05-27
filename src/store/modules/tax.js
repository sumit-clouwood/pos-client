import * as mutation from './tax/mutation-types'
// initial state
const state = {
  itemsTax: 0,
  itemsTaxData: [],
  surchargeTax: 0,
}

// getters
const getters = {
  totalTax: (state, getters, rootState) =>
    state.itemsTax + state.surchargeTax - rootState.discount.TaxDiscountAmount,
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
          itemTaxData.push({
            itemId: item._id,
            tax: item.grossPrice - item.netPrice,
          })

          return totalTax + (item.grossPrice - item.netPrice) * item.quantity
        }, 0)

        commit(mutation.SET_ITEMS_TAX, itemsTax)
        commit(mutation.SET_ITEMS_TAX_DATA, itemTaxData)

        //apply tax on surcharge that is calculated earlier
        if (rootState.surcharge.surchargeAmounts) {
          const surchargeTax = rootState.surcharge.surchargeAmounts.reduce(
            (totalTax, surcharge) => {
              if (surcharge.taxable) {
                return (
                  totalTax +
                  surcharge.tax.reduce((taxAmount, tax) => {
                    return taxAmount + (surcharge.amount * tax.rate) / 100
                  }, 0)
                )
              } else {
                return totalTax
              }
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
}

// mutations
const mutations = {
  [mutation.SET_ITEMS_TAX](state, tax) {
    state.itemsTax = tax
  },
  [mutation.SET_ITEMS_TAX_DATA](state, taxData) {
    state.itemsTaxData = taxData
  },
  [mutation.SET_SURCHARGE_TAX](state, tax) {
    state.surchargeTax = tax
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
