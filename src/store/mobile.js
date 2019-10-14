export default {
  state: {
    searchHendler: false,
    allCategoryHendler: true,
    subCategoryHendler: false,
    transactionDetailView: false,
    transactionListView: true,
    foodMenuHendler: true,
    mainOrdersHendler: false,
    totalWrapperHendler: false,
    footerButtonHendler: false,
    payNowCalcHendler: false,
    footerMenuHendler: true,
    profileHendler: false,
    paymentMethodsHendler: false,
    openManageCustomerHendler: false,
    itemFood: [],
    payMethod: 1,
    methodCardHendler: false,
    QRMethodChange: false,
    loyaltyHendler: false,
    discountHendler: false,
    addNoteHendler: false,
    loyaltyPaymentHendler: false,
    cardInputHendler: false,
    successfullHendler: false,
    openUserHendler: true,
    userLoginHendler: false,
    userCalcHendler: false,
    bascketItems: [],
    device: 'desktop',
    testUsers: [
      {
        id: 0,
        name: 'Aisyah Zidni',
        img: 'testUserImg-3.jpg',
        key: 1234,
      },
      {
        id: 1,
        name: 'Nirmala Azalea',
        img: 'testUserImg-1.jpg',
        key: 1234,
      },
      {
        id: 2,
        name: 'Bena Kane',
        img: 'testUserImg-2.jpg',
        key: 1234,
      },
      {
        id: 3,
        name: 'Firmino Kudo',
        img: 'testUserImg-0.jpg',
        key: 1234,
      },
    ],
  },
  mutations: {
    CLOSE_CATEGORY_AND_SUB_CATEGORY: state => {
      state.allCategoryHendler = false
      state.subCategoryHendler = false
      state.foodMenuHendler = true
    },
    SEARCH_HENDLER_CHANGE: state => {
      state.searchHendler = !state.searchHendler
    },
    ALL_CATEGORY_HENDLER_CHANGE: state => {
      state.allCategoryHendler = !state.allCategoryHendler
      state.subCategoryHendler = false
      state.foodMenuHendler = false
    },
    BACK_CATEGORY: state => {
      state.allCategoryHendler = !state.allCategoryHendler
      state.subCategoryHendler = false
      state.foodMenuHendler = !state.foodMenuHendler
    },
    BACK_SUB_CATEGORY: state => {
      state.allCategoryHendler = !state.allCategoryHendler
      state.subCategoryHendler = false
      state.foodMenuHendler = false
    },
    BACK_ITEM: state => {
      state.allCategoryHendler = false
      state.subCategoryHendler = true
      state.foodMenuHendler = false
    },
    TRANSACTION_DETAIL: state => {
      state.transactionDetailView = true
    },
    TRANSACTION_LIST: state => {
      state.transactionDetailView = false
    },
    SUB_CATEGORY_HENDLER_CHANGE: state => {
      state.allCategoryHendler = false
      state.subCategoryHendler = !state.subCategoryHendler
      state.foodMenuHendler = false
    },
    FOOD_MENU_HENDLER_CHANGE: state => {
      state.foodMenuHendler = true
      state.allCategoryHendler = false
      state.subCategoryHendler = false
    },
    MAIN_ORDERS_HENDLER_CHANGE: state => {
      state.allCategoryHendler = false
      state.subCategoryHendler = false
      state.mainOrdersHendler = !state.mainOrdersHendler
    },
    CART_CLOSE: state => {
      state.mainOrdersHendler = false
      state.footerButtonHendler = false
    },
    TOTAL_WRAPPER_HENDLER_CHANGE: state => {
      state.totalWrapperHendler = !state.totalWrapperHendler
    },
    FOOTER_BUTTON_HENDLER_CHANGE: state => {
      state.footerButtonHendler = !state.footerButtonHendler
    },
    PAY_NOW_CALC_HANDLER_CHANGE: state => {
      state.payNowCalcHendler = !state.payNowCalcHendler
    },
    FOOTER_MENU_HENDLER_CHANGE: state => {
      state.footerMenuHendler = !state.footerMenuHendler
    },
    PROFILE_HENDLER_CHANGE: state => {
      state.profileHendler = !state.profileHendler
    },
    PAYMENT_METHODS_CHANGE: state => {
      state.paymentMethodsHendler = !state.paymentMethodsHendler
      state.payNowCalcHendler = false
    },
    OPEN_MANAGE_CUSTOMER: state => {
      state.openManageCustomerHendler = !state.openManageCustomerHendler
    },
    ADD_ITEM_FOOD: (state, payLoad) => {
      if (!state.itemFood.some(item => item.name === payLoad.name)) {
        state.itemFood.unshift({
          name: payLoad.name,
          count: 1,
        })
      } else {
        state.itemFood.forEach(item => {
          if (item.name == payLoad.name) {
            item.count++
          }
        })
      }
    },
    METHOD_CARD_HENDLER_CHANGE: state => {
      state.methodCardHendler = !state.methodCardHendler
    },
    QR_METHOD_CHANGE_HENDLER: state => {
      state.QRMethodChange = !state.QRMethodChange
    },
    LOYALTY_HENDLER_CHANGE: state => {
      state.loyaltyHendler = !state.loyaltyHendler
    },
    DISCOUNT_HENDLER_CHANGE: state => {
      state.discountHendler = !state.discountHendler
    },
    ADD_NOTE_HENDLER_CHANGE: state => {
      state.addNoteHendler = !state.addNoteHendler
    },
    LOYALTY_PAYMMENT_HENDLER_CHANGE: state => {
      state.loyaltyPaymentHendler = !state.loyaltyPaymentHendler
    },
    CARD_INPUT_HENDLER_CHANGE: state => {
      state.cardInputHendler = !state.cardInputHendler
    },
    SUCCESSFULL_HENDLER_CHANGE: state => {
      state.successfullHendler = !state.successfullHendler
    },
    OPEN_USER_HENDLER_CHANGE: state => {
      state.openUserHendler = !state.openUserHendler
    },
    USER_LOGIN_HENDLER_CHANGE: state => {
      state.userLoginHendler = !state.userLoginHendler
    },
    USER_CALC_HENDLER_CHANGE: state => {
      state.userCalcHendler = !state.userCalcHendler
    },
    MOBILE_LOGOUT: state => {
      state.itemFood = []
      state.bascketItems = []
    },
    CHOOSE_CURENT_PAY_METHOD: (state, payLoad) => {
      state.payMethod = payLoad
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
  },
  actions: {
    CloseCategoryAndSubCategory({ commit }) {
      commit('CLOSE_CATEGORY_AND_SUB_CATEGORY')
    },
    backCategory({ commit }) {
      commit('BACK_CATEGORY')
    },
    backSubCategory({ commit }) {
      commit('BACK_SUB_CATEGORY')
    },
    backItem({ commit }) {
      commit('BACK_ITEM')
    },
    transactionList({ commit }) {
      commit('TRANSACTION_LIST')
    },
    transactionDetail({ commit }) {
      commit('TRANSACTION_DETAIL')
    },
    searchHendlerChange({ commit }) {
      commit('SEARCH_HENDLER_CHANGE')
    },
    allCategoryHendlerChange({ commit }) {
      commit('ALL_CATEGORY_HENDLER_CHANGE')
    },
    subCategoryHendlerChange({ commit }) {
      commit('SUB_CATEGORY_HENDLER_CHANGE')
    },
    foodMenuHendlerChange({ commit }) {
      commit('FOOD_MENU_HENDLER_CHANGE')
    },
    mainOrdersHendlerChange({ commit }) {
      commit('MAIN_ORDERS_HENDLER_CHANGE')
    },
    cartClose({ commit }) {
      commit('CART_CLOSE')
    },
    totalWrapperHendlerChange({ commit }) {
      commit('TOTAL_WRAPPER_HENDLER_CHANGE')
    },
    footerButtonHendlerChange({ commit }) {
      commit('FOOTER_BUTTON_HENDLER_CHANGE')
    },
    payNowCalcHendlerChange({ commit }) {
      commit('PAY_NOW_CALC_HANDLER_CHANGE')
    },
    footerMenuHendlerChange({ commit }) {
      commit('FOOTER_MENU_HENDLER_CHANGE')
    },
    profileHendlerChange({ commit }) {
      commit('PROFILE_HENDLER_CHANGE')
    },
    paymentMethodsChange({ commit }) {
      commit('PAYMENT_METHODS_CHANGE')
    },
    openManageCustomer({ commit }) {
      commit('OPEN_MANAGE_CUSTOMER')
    },
    addItemFood({ commit }, payLoad) {
      commit('ADD_ITEM_FOOD', payLoad)
    },
    methodCardHendlerChange({ commit }) {
      commit('METHOD_CARD_HENDLER_CHANGE')
    },
    QRMethodChangeHendler({ commit }) {
      commit('QR_METHOD_CHANGE_HENDLER')
    },
    loyaltyHendlerChange({ commit }) {
      commit('LOYALTY_HENDLER_CHANGE')
    },
    discountHendlerChange({ commit }) {
      commit('DISCOUNT_HENDLER_CHANGE')
    },
    addNoteHendlerChange({ commit }) {
      commit('ADD_NOTE_HENDLER_CHANGE')
    },
    loyaltyPaymentHendlerChange({ commit }) {
      commit('LOYALTY_PAYMMENT_HENDLER_CHANGE')
    },
    cardInputHendlerChange({ commit }) {
      commit('CARD_INPUT_HENDLER_CHANGE')
    },
    successfullHendlerChange({ commit }) {
      commit('SUCCESSFULL_HENDLER_CHANGE')
    },
    openUserHendlerChange({ commit }) {
      commit('OPEN_USER_HENDLER_CHANGE')
    },
    userLoginHendlerChange({ commit }) {
      commit('USER_LOGIN_HENDLER_CHANGE')
    },
    userCalcHendlerChange({ commit }) {
      commit('USER_CALC_HENDLER_CHANGE')
    },
    mobileLogout({ commit }) {
      commit('MOBILE_LOGOUT')
    },
    chooseCurentPayMethod({ commit }, payLoad) {
      commit('CHOOSE_CURENT_PAY_METHOD', payLoad)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
  },
  getters: {
    searchHendler: state => state.searchHendler,
    allCategoryHendler: state => state.allCategoryHendler,
    subCategoryHendler: state => state.subCategoryHendler,
    transactionDetailView: state => state.transactionDetailView,
    transactionListView: state => state.transactionListView,
    foodMenuHendler: state => state.foodMenuHendler,
    mainOrdersHendler: state => state.mainOrdersHendler,
    totalWrapperHendler: state => state.totalWrapperHendler,
    footerButtonHendler: state => state.footerButtonHendler,
    payNowCalcHendler: state => state.payNowCalcHendler,
    footerMenuHendler: state => state.footerMenuHendler,
    profileHendler: state => state.profileHendler,
    paymentMethodsHendler: state => state.paymentMethodsHendler,
    openManageCustomerHendler: state => state.openManageCustomerHendler,
    itemFood: state => state.itemFood,
    payMethod: state => state.payMethod,
    methodCardHendler: state => state.methodCardHendler,
    QRMethodChange: state => state.QRMethodChange,
    loyaltyHendler: state => state.loyaltyHendler,
    discountHendler: state => state.discountHendler,
    addNoteHendler: state => state.addNoteHendler,
    loyaltyPaymentHendler: state => state.loyaltyPaymentHendler,
    cardInputHendler: state => state.cardInputHendler,
    successfullHendler: state => state.successfullHendler,
    testUsers: state => state.testUsers,
    openUserHendler: state => state.openUserHendler,
    userLoginHendler: state => state.userLoginHendler,
    userCalcHendler: state => state.userCalcHendler,
    bascketItems: state => state.bascketItems,
    device: state => state.device,
  },
}
