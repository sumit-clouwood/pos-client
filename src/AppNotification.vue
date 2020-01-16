<template>
  <div
    class="modal fade"
    role="dialog"
    data-keyboard="false"
    data-backdrop="static"
    v-show="appUpdateNotification"
  >
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content" style="top: 30vh;">
        <div class="modal-header" style="background-color: rgb(245, 245, 245)">
          <h4 class="modal-title">{{ 'Update Available' }}</h4>
        </div>
        <div class="modal-body">
          <div v-show="appUpdateNotification">
            <span class="title">{{ 'Application update is available' }}</span>
          </div>
        </div>
        <div
          class="modal-footer"
          style="padding: 0.875rem 1.875rem 0.875rem 1.875rem; 
          border-top:1px solid grey;"
        >
          <button class="tables-btn-style" @click="reloadWindow">
            {{ _t('UPDATE') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'AppNotification',
  computed: {
    ...mapState('sync', ['modules', 'appUpdateNotification']),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    reloadWindow() {
      localStorage.setItem('update_available', false)
      window.location.reload(true)
    },
    // closeNotification() {
    //   this.$store.commit('sync/setAppUpdateNotification', false)
    // },
  },
  created() {
    if (!this.appUpdateNotification) {
      this.$store.commit(
        'sync/setAppUpdateNotification',
        localStorage.getItem('update_available') === 'true' ? true : false
      )
    }
  },
}
</script>
<style lang="scss">
@import './assets/scss/style.scss';
</style>
<style lang="scss" scoped>
.tables-btn-style {
  background: #5056ca;
  color: white;
  border: none;
  font-size: 12.75px;
}
.title {
  font-size: 14px;
}
</style>
