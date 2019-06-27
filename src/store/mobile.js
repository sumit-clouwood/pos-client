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
        payMethodHendler: ''
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
            if(state.itemFood.name == '...' || state.itemFood.name == payLoad.name){
                state.itemFood.curent = state.itemFood.curent + 1
            }
            else{
                state.itemFood.curent = 1
            }
            state.itemFood.name = payLoad.name
        },
        PAY_METHOD_HENDLER_CHANGE: (state, payLoad) => {
            state.payMethodHendler = payLoad
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
        cartClose({commit}){
            commit('CART_CLOSE')
        },
        totalWrapperHendlerGhange({commit}) {
            commit('TOTAL_WRAPPER_HENDLER_GHANGE')
        },
        footerButtonHendlerGhange({commit}){
            commit('FOOTER_BUTTON_HENDLER_GHANGE')
        },
        payNowCalcHendlerGhange({commit}) {
            commit('PAY_NOW_CALC_HANDLER_GHANGE')
        },
        footerMenuHendlerGhange({commit}){
            commit('FOOTER_MENU_HENDLER_GHANGE')
        },
        profileHendlerGhange({commit}){
            commit('PROFILE_HENDLER_GHANGE')
        },
        paymentMethodsHendlerGhange({commit}){
            commit('PAYMENT_METHODS_HENDLER_GHANGE')
        },
        openManageCustomer({commit}){
            commit('OPEN_MANAGE_CUSTOMER')
        },
        addItemFood({commit}, payLoad){
            commit('ADD_ITEM_FOOD', payLoad)
        },
        payMethodHendlerGhange({commit}, payLoad){
            commit('PAY_METHOD_HENDLER_CHANGE', payLoad)
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
        payMethodHendler: state => state.payMethodHendler,

    },
};
