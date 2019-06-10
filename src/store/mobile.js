export default {
    state: {
        searchHendler: false,
        allCategoryHendler: false,
        subCategoryHendler: false,
    },
    mutations: {
        SEARCH_HENDLER_CHANGE: (state) => {
            state.searchHendler = !state.searchHendler
        },
        ALL_CATEGORY_HENDLER_CHANGE: (state) => {
            state.allCategoryHendler = true
            state.subCategoryHendler = false
        },
        SUB_CATEGORY_HENDLER_CHANGE: (state) => {
            state.allCategoryHendler = false
            state.subCategoryHendler = true
        },
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
    },
    getters: {
        searchHendler: state => state.searchHendler,
        allCategoryHendler: state => state.allCategoryHendler,
        subCategoryHendler: state => state.subCategoryHendler,
    },
};
