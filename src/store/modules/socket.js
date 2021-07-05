/*
// /!* global showModal *!/
const state = {
  audio: false,
  lastOrderId: '',
  isSocketInit: false,
}
const getters = {}
const actions = {
  initSocket({ dispatch }, collection) {
    dispatch('makeAudioObject')
    dispatch('onlineOrderSetup', collection)
  },
  makeAudioObject({ state, commit }) {
    let audio = new Audio('/sounds/doorbell.ogg')
    commit('AUDIO_OBJECT', audio)
    state.audio.load()
    state.audio.addEventListener(
      'ended',
      function() {
        // this.interval = setTimeout(function() {
        //   // eslint-disable-next-line no-console
        //   console.log('this.interval')
        // }, 1000)
      },
      false
    )
  },
  onlineOrderSetup({ commit, state, dispatch, rootGetters }, collection) {
    let storeId = collection.storeId
    let payload = collection.payload
    let onlineOrders = rootGetters['deliveryManager/onlineOrders']
    // let storeId = this.store ? this.store._id : this.$route.params.store_id
    if (
      payload.data.store_id == storeId &&
      state.lastOrderId !== payload.data.order_id
    ) {
      commit('LAST_ORDER_ID', payload.data.order_id)
      dispatch('deliveryManager/getOnlineOrders', {}, { root: true }).then(
        () => {
          if (onlineOrders.count && payload.data.action_id === 'add') {
            dispatch('playSound')
          }
        }
      )
    }
  },
  playSound({ state }) {
    if (state.audio) state.audio.play()
    // showModal('#multiStores')
  },
  pauseSound({ state }) {
    if (state.audio) state.audio.pause()
  },
}
const mutations = {
  LAST_ORDER_ID: (state, orderId) => (state.lastOrderId = orderId),
  AUDIO_OBJECT: (state, audioObject) => (state.audio = audioObject),
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
*/
