import * as mutation from './location/mutation-types'

// initial state
const state = {
    location: "5a7c0d5014d488258b134a72",
    locationIds: [],
    locationName: 'fetching locations...'
};

// getters
const getters = {};

// actions
const actions = {
    set({commit}, userData) {
        // commit(mutation.SET_LOCATIONS, userData.location_id);
        commit(mutation.SET_LOCATION, userData.location_id);
        commit(mutation.SET_FRANCHISE_CODE, userData.franchies_code)
    }
};

// mutations
const mutations = {
    [mutation.SET_LOCATION](state, location) {
        state.location = location
    },
    /*[mutation.SET_LOCATIONS](state, location_id) {
        state.locationIds = location_id
    },*/
    [mutation.SET_FRANCHISE_CODE](state, franchise_code) {
        state.locationName = franchise_code
    }
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}