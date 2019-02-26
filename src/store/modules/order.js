import * as mutation from "./order/mutation-types";

// initial state
const state = {
  items: [],
  item: {}
};

// getters
const getters = {
  orderTotal: (state, getters, rootState) => {
    return (
      state.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0) +
      rootState.tax.itemsTax +
      rootState.tax.surchargeTax
    );
  },

  subTotal: () => {
    return state.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  },

  itemPrice: () => item => {
    return item.quantity * item.price;
  },

  orderModifiers: () => item => {
    return item.modifiers.length;
  },
  orderSurcharge: () => {},
  orderDiscount: () => {}
};

// actions
const actions = {
  addToOrder({ state, commit, rootState, dispatch }, item) {
    //set item price based on location, for modifiers items it is already set in modifer store
    if (
      item.get_item_location_price.location_id == rootState.location.location
    ) {
      item.price = parseFloat(item.get_item_location_price.menu_location_price);
    } else {
      item.price = parseFloat(item.item_price);
    }

    commit(mutation.SET_ITEM, item);

    const index = state.items.findIndex(
      orderItem => orderItem._id === state.item._id
    );
    if (index > -1) {
      commit(mutation.INCREMENT_ORDER_ITEM_QUANTITY, index);
    } else {
      commit(mutation.ADD_ORDER_ITEM, state.item);
    }
    dispatch("tax/calculate", {}, { root: true });
  },

  removeFromOrder({ commit, dispatch }, { item, index }) {
    commit(mutation.SET_ITEM, item);
    commit(mutation.REMOVE_ORDER_ITEM, index);
    commit(mutation.SET_ITEM, state.items[0]);
    dispatch("tax/calculate", {}, { root: true });
    dispatch("surcharge/calculate", {}, { root: true });
  },

  addModifierOrder({ commit, rootState, dispatch }) {
    let item = { ...rootState.modifier.item };
    commit(mutation.SET_ITEM, item);

    let itemModifierGroups = [];
    let itemModifiers = [];

    //adding modifers to item
    const modifiers = rootState.orderForm.modifiers.filter(
      modifier => modifier.itemId == item._id
    );
    modifiers.forEach(modifier => {
      itemModifierGroups.push(modifier);

      if (Array.isArray(modifier.modifierId)) {
        itemModifiers.push(...modifier.modifierId);
      } else {
        itemModifiers.push(modifier.modifierId);
      }
    });

    commit(mutation.ADD_MODIFIERS_TO_ITEM, {
      modifiers: itemModifiers,
      modifierGroups: itemModifierGroups
    });

    //calculating item price based on modifiers selected
    let modifierPrice = 0;
    //since we have just ids attached to item,
    //we need to consult modifier store for modifier data ie price

    rootState.modifier.itemModifiers.forEach(itemMod => {
      itemMod.modifiers.forEach(mod => {
        mod.get_modifier_sub_groups.forEach(subgroup => {
          subgroup.get_modifier_item_list.forEach(submod => {
            if (item.modifiers.includes(submod._id)) {
              modifierPrice += parseFloat(submod.price);
            }
          });
        });
      });
    });

    commit(mutation.ADD_MODIFIER_PRICE_TO_ITEM, modifierPrice);

    if (!item.editMode) {
      //update current item with new modifiers

      //check if item exists with same signature

      let itemExists = -1;

      state.items.forEach((orderItem, index) => {
        if (
          state.item._id == orderItem._id &&
          orderItem.modifiers.every(modifierId =>
            state.item.modifiers.includes(modifierId)
          ) &&
          orderItem.modifiers.length == state.item.modifiers.length
        ) {
          itemExists = index;
        }
      });

      if (itemExists > -1) {
        commit(mutation.INCREMENT_ORDER_ITEM_QUANTITY, itemExists);
      } else {
        commit(mutation.ADD_ORDER_ITEM_WITH_MODIFIERS, state.item);
      }
    } else {
      //edit mode
      //if the signature was different then modify modifiers,
      //as we are creating new item and attached modifiers again so its better to just
      //replace that item in state with existing item
      commit(mutation.UPDATE_MODIFER_ORDER_ITEM, {
        item: state.item
      });
    }
    dispatch("tax/calculate", {}, { root: true });
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

  [mutation.ADD_ORDER_ITEM_WITH_MODIFIERS](state, item) {
    item.quantity = 1;
    state.items.push(item);
  },

  [mutation.INCREMENT_ORDER_ITEM_QUANTITY](state, index) {
    //need to use array splice to make it reactive
    let orderItem = state.items[index];
    orderItem.quantity++;
    state.items.splice(index, 1, orderItem);
  },

  [mutation.REMOVE_ORDER_ITEM](state, index) {
    state.items = state.items.filter(function(orderItem, key) {
      return key != index;
    });
  },

  [mutation.UPDATE_MODIFER_ORDER_ITEM](state, { item }) {
    state.items.splice(item.orderIndex, 1, item);
  },

  [mutation.ADD_MODIFIERS_TO_ITEM](state, { modifiers, modifierGroups }) {
    state.item.modifiers = modifiers;
    state.item.modifierGroups = modifierGroups;
  },

  [mutation.ADD_MODIFIER_PRICE_TO_ITEM](state, modifierPrice) {
    state.item.price = parseFloat(state.item.price) + modifierPrice;
  },

  [mutation.SET_ITEM_TAX](state, tax) {
    state.item.tax = tax;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
