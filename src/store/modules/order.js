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
      return total + (item.price + item.tax) * item.quantity;
    }, 0);
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
  orderTax: () => {
    //return tax from tax store for order level tax
    return state.items.reduce((tax, item) => tax + item.tax, 0);
  },
  orderDiscount: () => {}
};

// actions
const actions = {
  addToOrder({ state, commit, rootState }, item) {
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
  },

  removeFromOrder({ commit }, item) {
    commit(mutation.SET_ITEM, item);
    commit(mutation.REMOVE_ORDER_ITEM, item);
    commit(mutation.SET_ITEM, state.items[0]);
  },

  addModifierOrder({ commit, rootState }) {
    let itemModifiers = [];
    let itemModifierGroups = [];
    let item = { ...rootState.modifier.item };

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

    item.modifiers = itemModifiers;
    item.modifierGroups = itemModifierGroups;

    let modifierPrice = 0;

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

    item.price = parseFloat(item.price) + modifierPrice;

    commit(mutation.SET_ITEM, item);

    //adding tax and discounts to item

    //STEP 1: calculate the item tax and add that to item
    let taxAmount = 0;

    if (item.item_tax.length) {
      taxAmount = item.item_tax.reduce(
        (taxAmount, taxItem) => taxAmount + parseFloat(taxItem.tax_amount),
        0
      );
    }

    //SETP 2 : add calculated tax to state.item, we can not use that directly so commit mutation here
    commit(mutation.SET_ITEM_TAX, taxAmount);

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
        commit(mutation.ADD_ORDER_ITEM_MODIFIER, state.item);
      }
    } else {
      //edit mode
      //if the signature was different then modify modifiers
      commit(mutation.UPDATE_MODIFER_ORDER_ITEM, {
        item: state.item
      });
    }
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

  [mutation.ADD_ORDER_ITEM_MODIFIER](state, item) {
    item.quantity = 1;
    state.items.push(item);
  },

  [mutation.INCREMENT_ORDER_ITEM_QUANTITY](state, index) {
    //need to use array splice to make it reactive
    let orderItem = state.items[index];
    orderItem.quantity++;
    state.items.splice(index, 1, orderItem);
  },

  [mutation.REMOVE_ORDER_ITEM](state, item) {
    state.items = state.items.filter(function(orderItem) {
      return orderItem._id != item._id;
    });
  },

  [mutation.UPDATE_MODIFER_ORDER_ITEM](state, { item }) {
    state.items.splice(item.orderIndex, 1, item);
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
