import PaymentService from '@/services/data/PaymentService'
import * as mutation from './payment/mutation-types'
import * as CONST from '@/constants'

// initial state
const state = {
  methods: {},
  appInvoiceData: {},
  groupedMethods: {},
  aggregatorGroups: [],
}

// getters
const getters = {
  methods: state => {
    return state.methods.data ? state.methods.data : []
  },
  cash: state => {
    let method = ''
    if (typeof state.methods.data != 'undefined') {
      method = state.methods.data.find(method => method.type === 'cash')
      if (!method) {
        method = state.methods.data.find(method => method.name.match(/cash/i))
      }
    }
    return method
  },

  getImages: (state, getters) => {
    //for caching
    let images = []

    getters.methods.forEach(method => {
      images.push(method.icon)
    })

    return images
  },
  findAggregateGroup: state => groupId => {
    if (!state.aggregatorGroups) return {}

    return state.aggregatorGroups.find(group => group._id === groupId)
  },
}

function makeTransFormat(translations) {
  let modifiedTrans = []
  translations.find(data => {
    let modifiedTransFinal = []
    if (typeof data.translations_dict != 'undefined') {
      Object.entries(data.translations_dict.name).forEach(trans => {
        if (trans.length) {
          let arr = { language: trans[0], value: trans[1] }
          modifiedTransFinal.push(arr)
        }
      })
      modifiedTrans.push({
        _id: data._id,
        translations_dict: { name: modifiedTransFinal },
      })
    }
  })
  return modifiedTrans
}

function getAggregatorMethods(aggregatorMethods) {
  let groups = aggregatorMethods.filter(method => method.group === true)

  let aggregateMethods = aggregatorMethods.reduce(
    (accumulator, currentmethod) => {
      let key = currentmethod._id

      if (currentmethod.group) {
        return accumulator
      } else if (!currentmethod.group && currentmethod.payment_type_group) {
        // if currentmethod is not a group and have a payment type group
        let group = groups.find(
          group => group._id === currentmethod.payment_type_group
        )
        key = group.name
        if (!accumulator[key]) {
          accumulator[key] = []
        }
      } else {
        // it means this method is not a part of any program/group
        key = currentmethod.name
        if (!accumulator[key]) {
          accumulator[key] = []
        }
      }

      accumulator[key].push(currentmethod)
      return accumulator
    },
    {}
  )
  return { groups, aggregateMethods }
}

// actions
const actions = {
  async fetchAll({ rootGetters, commit, getters }) {
    const paymentMethods = await PaymentService.fetchMethods()
    let payMethod = paymentMethods.data.data
    let methods = []
    let groupedMethods = payMethod.reduce((accumulator, currentmethod) => {
      const key = currentmethod['type']
      if (!accumulator[key]) {
        accumulator[key] = []
      }
      accumulator[key].push(currentmethod)
      return accumulator
    }, {})
    let aggregateMethods = getAggregatorMethods(groupedMethods['aggregator'])
    groupedMethods['aggregator'] = aggregateMethods['aggregateMethods']
    commit(mutation.SET_AGGREGATE_GROUPS, aggregateMethods['groups'])
    commit(mutation.SET_GROUPED_METHODS, groupedMethods)
    paymentMethods.data.data.forEach(method => {
      if (method.item_status) {
        switch (method.type) {
          case CONST.GIFT_CARD:
            if (rootGetters['modules/enabled'](CONST.MODULE_GIFT_CARDS)) {
              methods.push(method)
            }
            break
          case CONST.LOYALTY:
            if (rootGetters['modules/enabled'](CONST.MODULE_LOYALTY)) {
              methods.push(method)
            }
            break

          default:
            methods.push(method)
        }
        paymentMethods.data = methods
        commit(mutation.SET_METHODS, paymentMethods)
        //commit('checkoutForm/setMethod', state.methods.data[0], { root: true })
        commit('checkoutForm/setMethod', getters.cash, { root: true })
      }
    })
  },
  setTranslations({ commit, rootState }) {
    let allItems = []
    let allSurcharges = []
    let allModifiers = []
    let allPaymentTypes = []
    let allOrderDiscounts = []
    let allItemDiscounts = []
    if (rootState.category.items) {
      allItems = makeTransFormat(rootState.category.items)
    }
    if (rootState.surcharge.surcharges) {
      allSurcharges = makeTransFormat(rootState.surcharge.surcharges)
    }
    if (rootState.modifier.modifiers) {
      allModifiers = makeTransFormat(rootState.modifier.modifiers)
    }
    if (state.methods.data) {
      allPaymentTypes = makeTransFormat(state.methods.data)
    }
    if (rootState.discount.orderDiscounts) {
      allOrderDiscounts = makeTransFormat(rootState.discount.orderDiscounts)
    }
    if (rootState.discount.itemDiscounts) {
      allItemDiscounts = makeTransFormat(rootState.discount.itemDiscounts)
    }
    let translationsOnly = {
      brand_menu_items: allItems,
      brand_item_modifiers: allModifiers,
      brand_item_discounts: allItemDiscounts,
      brand_additional_surcharges: allSurcharges,
      brand_order_discounts: allOrderDiscounts,
      brand_payment_types: allPaymentTypes,
    }
    // eslint-disable-next-line no-console
    console.log(translationsOnly, 'translationsOnly')
    commit(mutation.APPINVOICEDATA, translationsOnly)
  },
}

// mutations
const mutations = {
  [mutation.SET_METHODS](state, methods) {
    state.methods = methods
  },
  [mutation.APPINVOICEDATA](state, printInvoiceData) {
    state.appInvoiceData = printInvoiceData
  },
  [mutation.RESET](state) {
    state.methods = {}
  },
  [mutation.SET_GROUPED_METHODS](state, groupedMethods) {
    state.groupedMethods = groupedMethods
  },
  [mutation.SET_AGGREGATE_GROUPS](state, aggregatorGroups) {
    state.aggregatorGroups = aggregatorGroups
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
