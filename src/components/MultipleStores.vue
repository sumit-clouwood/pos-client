<template>
  <div
    id="myModal"
    class="modal fade"
    role="dialog"
    data-keyboard="false"
    data-backdrop="static"
  >
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header" style="background-color: rgb(245, 245, 245)">
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            @click="pushDefaultStore"
          >
            &times;
          </button>
          <h4 class="modal-title">Select Store</h4>
        </div>
        <div class="modal-body stores-list-container">
          <div class="stores-list">
            <router-link
              v-for="store in multipleStores"
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
            type="button"
            class="btn btn-success btnClose"
            data-dismiss="modal"
            @click="pushDefaultStore"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapState } from 'vuex'
import DataService from '@/services/DataService'
export default {
  data() {
    return {
      stores: false,
      storeId: null,
    }
  },
  computed: {
    ...mapState('location', ['store', 'brand']),
    ...mapGetters('context', [
      'isStoreSelected',
      'haveMultipleStores',
      'multipleStores',
    ]),
    ...mapGetters({
      selectedBrand: ['context/brand'],
      defaultStore: ['context/store'],
    }),
  },
  methods: {
    selectedStoreId(storeId) {
      this.$store.commit('context/SET_BRAND_ID', this.brand._id, { root: true })
      this.$store.commit('context/SET_STORE_ID', storeId, { root: true })
      this.$store.commit('context/SET_SELECTED_STORE', true, { root: true })
      localStorage.setItem('brand_id', this.brand._id)
      localStorage.setItem('store_id', storeId)

      DataService.setContext({
        brand: this.$store.getters['context/brand'],
        store: this.$store.getters['context/store'],
      })
      $('#myModal').modal('hide')
      this.$router.go(this.$router.currentRoute)
    },
    pushDefaultStore() {
      if (!this.$route.params.store_id) this.$router.push(this.defaultStore)
    },
  },
}
</script>
<style lang="scss">
.modal-title {
  font-weight: 500;
}
.btnClose {
  margin-left: 21px;
  width: 10%;
}
.store-picker-single-item {
  background-color: rgb(68, 158, 255);
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  height: 100%;
  color: #3f4a4a;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(23, 23, 32, 0.05), 0 0 15px rgba(23, 23, 32, 0.05);
  padding: 1.875rem 1.875rem 3.125rem 1.875rem;
  text-align: left;
  justify-content: left;
  &:hover,
  &.active {
    color: rgb(255, 255, 255);
    background: rgb(68, 158, 255);
    transition: 0.2s ease-out;
  }
  .store-name {
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 3rem;
  }
  .store-address {
    font-size: 0.85rem;
    line-height: 1.8rem;
  }
  .store-phone {
    .icon-container {
      padding: 4px;
      margin-right: 5px;
      color: rgb(255, 255, 255);
      background: rgb(68, 158, 255);
      border-radius: 4px;
      .svg-block-icon {
        width: 1rem;
        height: 1rem;
        margin: 0 1px 4px 1px;
        fill: rgb(255, 255, 255);
      }
    }
    font-size: 1rem;
    line-height: 3rem;
    font-weight: bold;
  }
}
</style>
<style lang="scss" scoped>
.inner-container {
  width: 100%;
}
.stores-list-container {
  overflow: auto;
}
.modal-header {
  flex-direction: row-reverse;
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
  box-shadow: 0 0 5px rgba(23, 23, 32, 0.05), 0 0 15px rgba(23, 23, 32, 0.05);
  padding: 1.875rem 1.875rem 3.125rem 1.875rem;
  text-align: left;
  justify-content: left;
}
.store-picker-single-item:hover,
.store-picker-single-item:active {
  color: rgb(255, 255, 255);
  background: #00b0bd;
  -webkit-transition: 0.2s ease-out;
  transition: 0.2s ease-out;
  transform: scale(1.1);
}

.modal-dialog {
  max-width: 90% !important;
  min-height: 80% !important;
}
</style>
