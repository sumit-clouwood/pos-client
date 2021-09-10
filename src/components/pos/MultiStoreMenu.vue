<template>
  <div class="stores-list-container multi-store-menu-pos">
    <div class="stores-list">
      <router-link
        v-for="store in multiStores"
        :key="store._id"
        :to="selectedBrand + '/' + store._id"
        v-model="storeId"
        @click.native="selectedStoreId(store._id)"
      >
        <div class="store-picker-single-item">
          <div class="store-name">{{ store.name }}</div>
          <!--<div class="store-address">{{ store.address }}</div>
          <div class="store-address">{{ store.city }} {{ store.country }}</div>-->
          <div class="store-phone">
            {{ store.phone }}
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapState } from 'vuex'
import DataService from '@/services/DataService'
//#import bootstrap from '@/bootstrap'

export default {
  name: 'MultiStoreMenu',
  data() {
    return {
      stores: false,
      storeId: null,
    }
  },
  computed: {
    ...mapState('location', ['store', 'brand']),
    ...mapGetters('context', ['isStoreSelected']),
    ...mapGetters('brand', ['multiStores', 'hasMultiStores']),
    ...mapGetters({
      selectedBrand: ['context/brand'],
      defaultStore: ['context/store'],
    }),
  },
  methods: {
    selectedStoreId(storeId) {
      $('.multi-store-menu-pos').slideUp()
      $('.navigation .logo').removeClass('multistore')

      // this.$store.commit('context/SET_BRAND_ID', this.brand._id, { root: true })
      this.$store.commit('context/SET_STORE_ID', storeId)
      // localStorage.setItem('brand_id', this.brand._id)
      localStorage.setItem('store_id', storeId)

      DataService.setContext({
        brand: this.$store.getters['context/brand'],
        store: this.$store.getters['context/store'],
      })

      this.$store.dispatch('location/fetch')
      // bootstrap.fetchData()
      //#bootstrap.loadUI(this.$store)
      // this.$store.commit('sync/reload', true)
      // this.$store.dispatch('checkout/reset', true)
      // this.$store.commit('order/CLEAR_SELECTED_ORDER')
    },
  },
}
</script>
<style lang="scss" scoped>
.modal-title {
  font-weight: 500;
}
.tables-btn-style {
  margin-left: 21px;
  background: #cc3232;
  color: white;
  width: 10%;
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
  min-height: 80% !important;
}

.multi-store-menu-pos {
  position: fixed;
  z-index: 9999;
  left: 0;
  width: auto;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  height: 100vh;
  display: none;
}

.stores-list-container.multi-store-menu-pos > div {
  grid-template-columns: 1fr;
  grid-gap: 10px;
  border-bottom: 1px solid #dddd;
}

.stores-list-container.multi-store-menu-pos .store-picker-single-item {
  padding: 20px 10px;
  justify-content: center;
  border-radius: 0;
  min-height: 85px;
  align-items: center;
  display: grid;
}

.multi-store-menu-pos .store-name {
  line-height: normal;
  font-size: 15px;
}

.multi-store-menu-pos .stores-list {
  padding: 0;
}
@media only screen and (max-width: 991px) {
  .multi-store-menu-pos {
    display: none;
  }
}
</style>
