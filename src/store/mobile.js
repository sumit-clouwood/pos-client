export default {
    state: {
        searchHendler: false,
        allCategoryHendler: false,
        subCategoryHendler: false,
        foodMenuHendler: false,
        mainOrdersHendler: false,
        totalWrapperHendler: false,
        footerButtonHendler: false,
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
    },
};
