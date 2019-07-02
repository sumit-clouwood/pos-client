export default {
    state: {
        searchHendler: false,
        allCategoryHendler: false,
        subCategoryHendler: false,
        foodMenuHendler: true,
        mainOrdersHendler: false,
        totalWrapperHendler: false,
        footerButtonHendler: false,
        payNowCalcHendler: false,
        footerMenuHendler: true,
        profileHendler: false,
        paymentMethodsHendler: false,
        openManageCustomerHendler: false,
        itemFood: {
            name: '...',
            curent: 0
        },
        payMethod: 'Gift Card',
        methodCardHendler: false,
        QRMethodGhange: false,
        loyaltyHendler: false,
        discountHendler: false,
        addNoteHendler: false,
        loyaltyPaymentHendler: false,
        cardInputHendler: false,
        successfullHendler: false
    },
    mutations: {
        SEARCH_HENDLER_CHANGE: (state) => {
            state.searchHendler = !state.searchHendler
        },
        ALL_CATEGORY_HENDLER_CHANGE: (state) => {
            state.allCategoryHendler = !state.allCategoryHendler
            state.subCategoryHendler = false
            state.foodMenuHendler = false
        },
        SUB_CATEGORY_HENDLER_CHANGE: (state) => {
            state.allCategoryHendler = false
            state.subCategoryHendler = !state.subCategoryHendler
            state.foodMenuHendler = false
        },
        FOOD_MENU_HENDLER_GHANGE: (state) => {
            state.foodMenuHendler = true
            state.allCategoryHendler = false
            state.subCategoryHendler = false
        },
        MAIN_ORDERS_HENDLER_GHANGE: (state) => {
            state.allCategoryHendler = false
            state.subCategoryHendler = false
            state.mainOrdersHendler = true
        },
        CART_CLOSE: (state) => {
            state.mainOrdersHendler = false
            state.footerButtonHendler = false
        },
        TOTAL_WRAPPER_HENDLER_GHANGE: (state) => {
            state.totalWrapperHendler = !state.totalWrapperHendler
        },
        FOOTER_BUTTON_HENDLER_GHANGE: (state) => {
            state.footerButtonHendler = !state.footerButtonHendler
        },
        PAY_NOW_CALC_HANDLER_GHANGE: (state) => {
            state.payNowCalcHendler = !state.payNowCalcHendler
        },
        FOOTER_MENU_HENDLER_GHANGE: (state) => {
            state.footerMenuHendler = !state.footerMenuHendler
        },
        PROFILE_HENDLER_GHANGE: (state) => {
            state.profileHendler = !state.profileHendler
        },
        PAYMENT_METHODS_HENDLER_GHANGE: (state) => {
            state.paymentMethodsHendler = !state.paymentMethodsHendler
            state.payNowCalcHendler = false
        },
        OPEN_MANAGE_CUSTOMER: (state) => {
            state.openManageCustomerHendler = !state.openManageCustomerHendler
        },
        ADD_ITEM_FOOD: (state, payLoad) => {
            if (state.itemFood.name == '...' || state.itemFood.name == payLoad.name) {
                state.itemFood.curent = state.itemFood.curent + 1
            } else {
                state.itemFood.curent = 1
            }
            state.itemFood.name = payLoad.name
        },
        METHOD_CARD_HENDLER_CHANGE: (state) => {
            state.methodCardHendler = !state.methodCardHendler
        },
        QR_METHOD_GHANGE_HENDLER: (state) => {
            state.QRMethodGhange = !state.QRMethodGhange
        },
        LOYALTY_HENDLER_GHANGE: (state) => {
            state.loyaltyHendler = !state.loyaltyHendler
        },
        DISCOUNT_HENDLER_GHANGE: (state) => {
            state.discountHendler = !state.discountHendler
        },
        ADD_NOTE_HENDLER_GHANGE: (state) => {
            state.addNoteHendler = !state.addNoteHendler
        },
        LOYALTY_PAYMMENT_HENDLER_GHANGE: (state) => {
            state.loyaltyPaymentHendler = !state.loyaltyPaymentHendler
        },
        CARD_INPUT_HENDLER_GHANGE: (state) => {
            state.cardInputHendler = !state.cardInputHendler
        },
        SUCCESSFULL_HENDLER_GHANGE: (state) => {
            state.successfullHendler = !state.successfullHendler
        }
    },
    actions: {
        searchHendlerChange({commit}) {
            commit('SEARCH_HENDLER_CHANGE')
        },
        allCategoryHendlerChange({commit}) {
            commit('ALL_CATEGORY_HENDLER_CHANGE')
        },
        subCategoryHendlerChange({commit}) {
            commit('SUB_CATEGORY_HENDLER_CHANGE')
        },
        foodMenuHendlerGhange({commit}) {
            commit('FOOD_MENU_HENDLER_GHANGE')
        },
        mainOrdersHendlerGhange({commit}) {
            commit('MAIN_ORDERS_HENDLER_GHANGE')
        },
        cartClose({commit}) {
            commit('CART_CLOSE')
        },
        totalWrapperHendlerGhange({commit}) {
            commit('TOTAL_WRAPPER_HENDLER_GHANGE')
        },
        footerButtonHendlerGhange({commit}) {
            commit('FOOTER_BUTTON_HENDLER_GHANGE')
        },
        payNowCalcHendlerGhange({commit}) {
            commit('PAY_NOW_CALC_HANDLER_GHANGE')
        },
        footerMenuHendlerGhange({commit}) {
            commit('FOOTER_MENU_HENDLER_GHANGE')
        },
        profileHendlerGhange({commit}) {
            commit('PROFILE_HENDLER_GHANGE')
        },
        paymentMethodsHendlerGhange({commit}) {
            commit('PAYMENT_METHODS_HENDLER_GHANGE')
        },
        openManageCustomer({commit}) {
            commit('OPEN_MANAGE_CUSTOMER')
        },
        addItemFood({commit}, payLoad) {
            commit('ADD_ITEM_FOOD', payLoad)
        },
        methodCardHendlerGhange({commit}) {
            commit('METHOD_CARD_HENDLER_CHANGE')
        },
        QRMethodGhangeHendler({commit}) {
            commit('QR_METHOD_GHANGE_HENDLER')
        },
        loyaltyHendlerGhange({commit}) {
            commit('LOYALTY_HENDLER_GHANGE')
        },
        discountHendlerGhange({commit}) {
            commit('DISCOUNT_HENDLER_GHANGE')
        },
        addNoteHendlerGhange({commit}) {
            commit('ADD_NOTE_HENDLER_GHANGE')
        },
        loyaltyPaymentHendlerGhange({commit}) {
            commit('LOYALTY_PAYMMENT_HENDLER_GHANGE')
        },
        cardInputHendlerGhange({commit}) {
            commit('CARD_INPUT_HENDLER_GHANGE')
        },
        successfullHendlerGhange({commit}) {
            commit('SUCCESSFULL_HENDLER_GHANGE')
        }
    },
    getters: {
        searchHendler: state => state.searchHendler,
        allCategoryHendler: state => state.allCategoryHendler,
        subCategoryHendler: state => state.subCategoryHendler,
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
        QRMethodGhange: state => state.QRMethodGhange,
        loyaltyHendler: state => state.loyaltyHendler,
        discountHendler: state => state.discountHendler,
        addNoteHendler: state => state.addNoteHendler,
        loyaltyPaymentHendler: state => state.loyaltyPaymentHendler,
        cardInputHendler: state => state.cardInputHendler,
        successfullHendler: state => state.successfullHendler
    },
};
