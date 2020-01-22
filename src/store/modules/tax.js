import TaxService from '@/services/data/TaxService'

const state = {
  taxes: [],
  openItemTax: null,
  openItemId: null,
}

const getters = {
  applicableTaxes: (state, getters, rootState) => {
    const taxes = []
    state.taxes.forEach(tax => {
      //check all
      if (tax.price_availability.all) {
        taxes.push({ tax: tax, value: tax.price_availability.all })
      } else if (tax.price_availability.stores.length) {
        tax.price_availability.stores.forEach(storeTax => {
          if (storeTax.param === rootState.context.storeId) {
            taxes.push({ tax: tax, value: storeTax.value })
          }
        })
      } else if (tax.price_availability.cities.length) {
        tax.price_availability.cities.forEach(storeTax => {
          if (storeTax.param === rootState.location.store.city) {
            taxes.push({ tax: tax, value: storeTax.value })
          }
        })
      } else if (tax.price_availability.countries.length) {
        tax.price_availability.countries.forEach(storeTax => {
          if (storeTax.param === rootState.location.store.country) {
            taxes.push({ tax: tax, value: storeTax.value })
          }
        })
      }
    })
    if (taxes.length) {
      return taxes.reduce((totalTax, taxItem) => (totalTax += taxItem.value), 0)
    }
  },
}

const actions = {
  fetchAll({ commit, rootState, dispatch }) {
    TaxService.fetchAll(rootState.order.orderType.OTApi).then(response => {
      //If taxes available for location.
      if (response.data.data.length) {
        commit('SET_TAXES', response.data.data)
      }
    })
    dispatch('openItemTaxes')
  },
  openItemTaxes({ commit }) {
    TaxService.fetchOpenItemTaxes().then(response => {
      //If taxes available for location.
      if (response.data) {
        commit('SET_OPEN_ITEM_ID', response.data.entity_id)
        commit('SET_OPEN_ITEM_TAX', response.data.tax_sum)
      }
    })
  },
  reset({ commit }) {
    commit('RESET')
  },
}

const mutations = {
  SET_TAXES(state, taxes) {
    state.taxes = taxes
  },
  SET_OPEN_ITEM_ID(state, id) {
    state.openItemId = id
  },
  SET_OPEN_ITEM_TAX(state, tax) {
    state.openItemTax = tax
  },
  RESET(state) {
    state.taxes = []
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
