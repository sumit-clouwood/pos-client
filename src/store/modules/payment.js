import PaymentService from '@/services/data/PaymentService'
import * as mutation from './payment/mutation-types'
import * as CONST from '@/constants'
import { isObjectEmpty } from '@/util.js'

// initial state
const state = {
  methods: {},
  appInvoiceData: {},
  aggregatorGroups: [],
}

// getters
const getters = {
  methods: state => {
    return state.methods ? state.methods : []
  },
  cash: state => {
    let method = ''
    if (state.methods) {
      // eslint-disable-next-line no-unused-vars
      for (let [key, arrayOfMethods] of Object.entries(state.methods)) {
        method = arrayOfMethods.find(method => method.type === CONST.CASH)
        if (method) {
          break
        }
      }
      return method ? method : []
    }
    return []
  },

  getImages: (state, getters) => {
    //for caching
    let images = []

    Object.entries(getters.methods).forEach(method => {
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
  if (Array.isArray(translations)) {
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
  } else {
    Object.entries(translations).find(data => {
      let modifiedTransFinal = []
      if (Array.isArray(data)) {
        data[1].forEach(item => {
          if (typeof item.translations_dict != 'undefined') {
            Object.entries(item.translations_dict.name).forEach(trans => {
              if (trans.length) {
                let arr = { language: trans[0], value: trans[1] }
                modifiedTransFinal.push(arr)
              }
            })
            modifiedTrans.push({
              _id: item._id,
              translations_dict: { name: modifiedTransFinal },
            })
          }
        })
      }
    })
  }

  return modifiedTrans
}

function getAggregatorMethods(aggregatorMethods) {
  if (typeof aggregatorMethods != undefined) {
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
          key = group ? group.name : currentmethod.payment_type_group
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
  return { groups: {}, aggregateMethods: {} }
}

// actions
const actions = {
  async fetchAll({ rootGetters, commit, getters }) {
    const paymentMethods = await PaymentService.fetchMethods()
    let payMethod = paymentMethods.data.data
    let methods = payMethod.reduce((accumulator, currentmethod) => {
      const key = currentmethod['type']
      if (!accumulator[key]) {
        accumulator[key] = []
      }
      if (currentmethod.type === CONST.LOYALTY) {
        if (rootGetters['modules/enabled'](CONST.MODULE_LOYALTY)) {
          accumulator[key].push(currentmethod)
        }
      } else if (currentmethod.type === CONST.GIFT_CARD) {
        if (rootGetters['modules/enabled'](CONST.MODULE_GIFT_CARDS)) {
          accumulator[key].push(currentmethod)
        }
      } else {
        if (
          currentmethod.type != CONST.ONLINE &&
          currentmethod.type != CONST.GO_ORDER_LOYALTY
        ) {
          accumulator[key].push(currentmethod)
        }
      }
      return accumulator
    }, {})
    if (methods[CONST.AGGREGATOR]) {
      let aggregateMethods = getAggregatorMethods(methods[CONST.AGGREGATOR])
      let filtered = Object.values(aggregateMethods['aggregateMethods'])
      // If there are no aggregator payment types, only groups, remove the aggregator key as well
      if (filtered.length) {
        methods[CONST.AGGREGATOR] = [aggregateMethods['aggregateMethods']]
        commit(mutation.SET_AGGREGATE_GROUPS, aggregateMethods['groups'])
      } else {
        delete methods[CONST.AGGREGATOR]
      }
    }
    commit(mutation.SET_METHODS, methods)
    //IF NOT ALREADY SET THEN SET ONLY, OTHERWISE IT LL OVERRIDE
    if (isObjectEmpty(rootGetters['checkoutForm/payment_method'])) {
      commit('checkoutForm/setMethod', getters.cash, { root: true })
    }
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
    if (state.methods) {
      allPaymentTypes = makeTransFormat(state.methods)
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
