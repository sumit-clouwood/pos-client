import * as mutation from './tax/mutation-types'
// initial state
const state = {
  itemsTax: 0,
  surchargeTax: 0,
}

// getters
const getters = {
  totalTax: state => state.itemsTax + state.surchargeTax,
}

// actions
const actions = {
  calculate({ commit, rootState }) {
    const orderSubtotal = rootState.order.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    if (orderSubtotal) {
      const itemsTax = rootState.order.items.reduce((totalTax, item) => {
        if (item.item_tax) {
          return (
            totalTax +
            item.item_tax.reduce((total, tax) => {
              if (!tax.get_item_tax || !tax.get_item_tax.rate) {
                return total
              }
              return (
                total +
                (item.price * item.quantity * tax.get_item_tax.rate) / 100
              )
            }, 0)
          )
        } else {
          return totalTax + 0
        }
      }, 0)
      commit(mutation.SET_ITEMS_TAX, itemsTax)
    } else {
      commit(mutation.SET_ITEMS_TAX, 0)
    }

    //apply tax on surcharge that is calculated earlier
    if (orderSubtotal && rootState.surcharge.surchargeAmounts) {
      const surchargeTax = rootState.surcharge.surchargeAmounts.reduce(
        (totalTax, surcharge) => {
          if (surcharge.tax) {
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
  },
}

// mutations
const mutations = {
  [mutation.SET_ITEMS_TAX](state, tax) {
    state.itemsTax = tax
  },
  [mutation.SET_SURCHARGE_TAX](state, tax) {
    state.surchargeTax = tax
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
