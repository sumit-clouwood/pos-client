<template>
  <div class="profile-content" v-if="user">
    <div class="profile-container">
      <div class="profile-picture-container">
        <img
          :src="user.avatar ? user.avatar : 'img/profile/default_avatar.jpg'"
          class="profile-picture"
        />
      </div>
      <div class="items">
        <span class="caption">{{ _t('Name') }}:</span>
        <span>{{ user.name }}</span>

        <span class="caption">{{ _t('Email') }}:</span>
        <span>{{ user.email }}</span>

        <span class="caption">{{ _t('Created At') }}:</span>
        <span>
          {{ toLocaleDateTimeString(user.created_at.date) }}
        </span>

        <span class="caption">{{ _t('Last Updated At') }}:</span>
        <span>
          {{ toLocaleDateTimeString(user.updated_at.date) }}
        </span>

        <span class="caption">{{ _t('Created By') }}:</span>
        <span v-if="collectedData.created_at_name">
          {{ collectedData.created_at_name }}
          {{ collectedData.created_at_email }}
        </span>
        <span v-else> - </span>
        <span class="caption">{{ _t('Preferred Language') }}:</span>
        <span>{{ collectedData.language_name }}</span>

        <span class="caption">{{ _t('User Type') }}:</span><span>Regular</span>
      </div>
    </div>
    <div class="delimiter">&nbsp;</div>
    <div class="profile-brand-container">
      <div class="items">
        <span class="caption">{{ _t('Associated Brand') }}:</span>
        <span v-if="!isSuperAdmin()">
          {{
            LookupData.getUserAssociatedDetails({
              collection: brands._id,
              matchWith: user.brand_id,
              selection: 'name',
            })
          }}
        </span>
        <span v-else>Not Associated to Brand</span>

        <span class="caption">{{ _t('Associated Brand Role') }}:</span>
        <span v-if="!isSuperAdmin()">
          {{ role.name }}
        </span>
        <span v-else>Not Applicable</span>
        <span v-if="!isSuperAdmin()" class="caption"
          >{{ _t('Has Access to') }}:
        </span>
        <span v-if="!isSuperAdmin()">
          <span v-for="storeId in user.brand_stores" :key="storeId">
            {{ _t('Stores') }}:
            {{
              LookupData.getUserAssociatedDetails({
                collection: rootStore._id,
                matchWith: storeId,
                selection: 'name',
              })
            }},
          </span>
        </span>
      </div>
    </div>
    <div class="buttons">
      <router-link
        :to="'/cashier-login' + store"
        v-if="enabledModule('switchCashier')"
      >
        <button
          @click.native="logoutCashier"
          id="switch-user-btn-profile"
          type="button"
          class="btn btn-danger cancel-announce color-icon-table-neutral-button font-weight-bold"
        >
          {{ _t('Switch Cashier') }}
        </button>
      </router-link>
      <button
        type="button"
        class="btn btn-danger cancel-announce color-icon-table-neutral-button font-weight-bold logout"
        @click="logout($router.push('/'))"
      >
        {{ _t('Logout') }}
      </button>
    </div>
  </div>
</template>

<script>
import DateTime from '@/mixins/DateTime'
import AuthService from '@/services/data/AuthService'
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  name: 'UserProfile',
  mixins: [DateTime],
  methods: {
    logoutCashier() {
      localStorage.setItem('token', '')
      this.$store.commit('auth/SET_TOKEN', '')
      this.$store.commit('auth/LOGOUT_ACTION', 'switchCashier')
      //this.$router.push({ path: '/cashier-login/' + this.storeUrl })
      AuthService.logout().then(() => {})
    },
    ...mapActions('auth', ['logout']),
    enabledModule(option) {
      switch (option) {
        case 'switchCashier':
          return !this.carhop && !this.waiter
      }
    },
  },
  computed: {
    ...mapGetters('context', ['store']),
    ...mapGetters('auth', ['waiter', 'carhop']),
    ...mapState({
      user: state => state.auth.userDetails.item,
      role: state => state.auth.role,
      collectedData: state => state.auth.userDetails.collected_data,
      rootStore: state =>
        state.auth.userDetails.collected_data.page_lookups.root_stores,
      rootBrandRoles: state =>
        state.auth.userDetails.collected_data.page_lookups.root_brand_roles,
      brands: state =>
        state.auth.userDetails
          ? state.auth.userDetails.collected_data.page_lookups.brands
          : false,
    }),
    ...mapGetters('location', ['_t']),
  },
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/variables.scss';
.logout {
  float: right;
}
.buttons {
  margin-top: 2%;
}
.profile-container,
.profile-brand-container {
  box-shadow: none;
  border: 1px solid blue;
}
#dm-content-wrapper {
  margin-top: 2%;
}
#switch-user-btn-profile {
  background: $blue-light;
  border-color: $blue-light;
}
</style>
