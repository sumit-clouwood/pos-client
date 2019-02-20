import * as mutation from "./order/mutation-types";

// initial state
const state = {
  items: [],
  item: {}
};

// getters
const getters = {
  orderTotal: () => {
    return state.items.reduce((total, item) => {
      return total + item.item_price * item.quantity;
    }, 0);
  },

  subTotal: () => {
    return state.items.reduce((total, item) => {
      return total + item.item_price * item.quantity;
    }, 0);
  },

  itemPrice: () => item => {
    return item.quantity * item.item_price;
  },

  orderModifiers: () => item => {
    return item.modifiers.length;
  },

  orderSurcharge: () => {},
  orderTax: () => {},
  orderDiscount: () => {}
};

// actions
const actions = {
  addToOrder({ commit, state }, item) {
    //set item price based on location
    commit(mutation.SET_ITEM, item);

    const orderItem = state.items.find(
      orderItem => orderItem._id === state.item._id
    );
    if (orderItem) {
      commit(mutation.INCREMENT_ORDER_ITEM_QUANTITY, orderItem._id);
    } else {
      commit(mutation.ADD_ORDER_ITEM, state.item);
    }
  },

  removeFromOrder({ commit }, item) {
    commit(mutation.SET_ITEM, item);
    commit(mutation.REMOVE_ORDER_ITEM, item);
    commit(mutation.SET_ITEM, state.items[0]);
  }
};

// mutations
const mutations = {
  [mutation.SET_ITEM](state, item) {
    state.item = item;
  },

  [mutation.ADD_ORDER_ITEM](state, item) {
    item.quantity = 1;
    item.modifiers = [];

    state.items.push(item);
  },

  [mutation.INCREMENT_ORDER_ITEM_QUANTITY](state, itemId) {
    //need to use array splice to make it reactive
    let orderItem = state.items.find(item => item._id == itemId);
    orderItem.quantity++;
    const index = state.items.findIndex(item => item._id == itemId);
    state.items.splice(index, 1, orderItem);
  },

  [mutation.REMOVE_ORDER_ITEM](state, item) {
    state.items = state.items.filter(function(orderItem) {
      return orderItem._id != item._id;
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
