<template>
  <div
    id="multiStoresModal"
    class="modal fade"
    role="dialog"
    data-keyboard="false"
    data-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header" style="background-color: rgb(245, 245, 245)">
          <h4 class="modal-title">{{ _t('Select Store') }}</h4>
        </div>
        <div class="modal-body stores-list-container">
          <div class="stores-list">
            <router-link
              v-for="store in multiStores"
              append
              :key="store._id"
              :to="selectedBrand + '/' + store._id"
              v-model="storeId"
              @click.native="selectedStoreId(store._id)"
            >
              <div class="store-picker-single-item">
                <div class="store-name">{{ store.name }}</div>
                <div class="store-address">{{ store.address }}</div>
                <div class="store-address">
                  {{ store.city }} {{ store.country }}
                </div>
                <div class="store-phone">
                  {{ store.phone }}
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div class="modal-footer">
          <button
            v-if="currentStoreId"
            type="button"
            class="tables-btn-style"
            data-dismiss="modal"
          >
            {{ _t('Close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'MultiStore',
  data() {
    return {
      stores: false,
      storeId: null,
    }
  },
  computed: {
    ...mapState('location', ['store', 'brand']),
    ...mapState('sync', ['loaded']),
    ...mapGetters('context', ['isStoreSelected']),
    ...mapGetters('brand', ['hasMultiStores', 'multiStores']),
    ...mapState({
      currentStoreId: state => state.context.storeId,
    }),
    ...mapGetters('location', ['_t']),
    ...mapGetters({
      selectedBrand: ['context/brand'],
      defaultStore: ['context/store'],
    }),
  },
  methods: {
    selectedStoreId(storeId) {
      //show the loader only when switching the store, don't show it right after login when there are multiple stores
      //reset all previous data
      //reset loaded status of sync

      this.$store.dispatch('context/setStoreContext', storeId)
      this.$store.commit(
        'context/SET_CURRENT_STORE',
        this.multiStores.find(store => store._id === storeId)
      )

      $('#multiStoresModal').modal('hide')
      //to reload location api as well, pass sw as an argument
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.modal-title {
  font-weight: 500;
}
.tables-btn-style {
  margin-left: 21px;
  background: #cc3232;
  color: white;
  width: 10%;
  @include responsive(mobile) {
    width: 30%;
  }
  border: none;
  font-size: 12.75px;
}
.inner-container {
  width: 100%;
}
.stores-list-container {
  overflow: auto;
}
.modal-header {
  flex-direction: row;
  background-color: rgb(245, 245, 245);
}
.store-name {
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  line-height: 3rem;
}
.stores-list {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  @include responsive(mobile) {
    grid-template-columns: 1fr;
    padding: 0px;
  }
  grid-gap: 1.5625rem;
  padding-top: 1.5625rem;
  padding-bottom: 1.5625rem;
  padding-left: 1.5625rem;
  padding-right: 1.5625rem;
}
.store-address {
  font-size: 0.85rem;
  line-height: 1.8rem;
}
.store-picker-single-item {
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  height: 100%;
  cursor: pointer;
  color: #3f4a4a;
  box-shadow: 0 0 5px rgba(23, 23, 32, 0.05), 0 0 15px rgba(23, 23, 32, 0.05);
  padding: 1.875rem 1.875rem 3.125rem 1.875rem;
  text-align: left;
  justify-content: left;
}
.store-picker-single-item:hover,
.store-picker-single-item:active {
  color: rgb(255, 255, 255);
  background: #5056ca;
  -webkit-transition: 0.2s ease-out;
  transition: 0.2s ease-out;
  transform: scale(1.1);
}

.modal-dialog {
  max-width: 90% !important;
  @include responsive(mobile) {
    max-width: 95% !important;
  }
  min-height: 80% !important;
}
.modal-content {
  width: 95%;
  margin: auto;
  margin-top: 10%;
}
</style>
