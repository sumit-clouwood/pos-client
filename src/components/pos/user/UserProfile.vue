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

        <span v-if="user.created_at" class="caption"
          >{{ _t('Created At') }}:</span
        >
        <span v-if="user.created_at">
          {{ toLocaleDateTimeString(user.created_at.date) }}
        </span>

        <span class="caption" v-if="user.updated_at"
          >{{ _t('Last Updated At') }}:</span
        >
        <span v-if="user.updated_at">
          {{ toLocaleDateTimeString(user.updated_at.date) }}
        </span>

        <span v-if="collectedData" class="caption"
          >{{ _t('Created By') }}:</span
        >
        <span v-if="collectedData">
          {{ collectedData.created_at_name }}
          {{ collectedData.created_at_email }}
        </span>
        <span v-if="user.preffered_language" class="caption"
          >{{ _t('Preferred Language') }}:</span
        >
        <span v-if="user.preffered_language">{{
          user.preffered_language
        }}</span>

        <span class="caption">{{ _t('User Type') }}: </span>
        <span>{{ _t('Regular') }}</span>
      </div>
      <div class="buttons">
        <!-- TODO later, backlogged for now -->
        <!-- <button
          type="button"
          v-if="allowed(PERMS.CHANGE_AVATAR)"
          @click="showPopup('#avatar-modal')"
          class="btn btn-success color-icon-table-neutral-button font-weight-bold"
        >
          Change Avatar
        </button> -->
        <button
          type="button"
          v-if="allowed(PERMS.CHANGE_NAME_EMAIL)"
          @click="showPopup('#name-email-modal')"
          class="btn btn-success color-icon-table-neutral-button font-weight-bold"
        >
          Change Name and Email
        </button>
        <button
          type="button"
          v-if="allowed(PERMS.CHANGE_PASSWORD)"
          @click="showPopup('#password-modal')"
          class="btn btn-success color-icon-table-neutral-button font-weight-bold"
        >
          Change Password
        </button>
      </div>
    </div>

    <div class="delimiter">&nbsp;</div>
    <div class="profile-brand-container">
      <div class="items">
        <span v-if="brands" class="caption">{{ _t('Associated Brand') }}:</span>
        <span v-if="brands">
          {{
            LookupData.getUserAssociatedDetails({
              collection: brands._id,
              matchWith: user.brand_id,
              selection: 'name',
            })
          }}
        </span>
        <br v-else />
        <span class="caption">{{ _t('Associated Brand Role') }}:</span>
        <span v-if="role">
          {{ role.name }}
        </span>
        <br v-else />
        <span class="caption"> {{ _t('Has Access to') }}: </span>
        <span v-if="user.brand_stores && user.brand_stores.length">
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
      <div class="buttons">
        <button
          type="button"
          class="btn btn-success color-icon-table-neutral-button font-weight-bold"
          v-if="enabledModule('switchCashier')"
          @click="logoutCashier"
        >
          {{ _t('Switch Cashier') }}
        </button>
        <button
          type="button"
          class="btn btn-danger cancel-announce color-icon-table-neutral-button font-weight-bold logout"
          @click="logout($router.push('/'))"
        >
          {{ _t('Logout') }}
        </button>
      </div>
    </div>

    <ChangeNameEmail :user="user" />
    <ChangePassword />
    <!-- <ChangeAvatar /> -->
  </div>
</template>

<script>
/* global $ */
import DateTime from '@/mixins/DateTime'
import AuthService from '@/services/data/AuthService'
import ChangeNameEmail from './popups/ChangeNameEmail'
import ChangePassword from './popups/ChangePassword'
// import ChangeAvatar from './popups//ChangeAvatar'
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  name: 'UserProfile',
  mixins: [DateTime],
  components: {
    ChangeNameEmail,
    ChangePassword,
    // ChangeAvatar,
  },
  methods: {
    logoutCashier() {
      localStorage.setItem('token', '')
      this.$store.commit('auth/SET_TOKEN', '')
      this.$store.commit('auth/LOGOUT_ACTION', 'switchCashier')
      this.$router.push('/cashier-login/' + this.store)
      AuthService.logout().then(() => {})
    },
    ...mapActions('auth', ['logout']),
    enabledModule(option) {
      switch (option) {
        case 'switchCashier':
          return !this.carhop && !this.waiter
      }
    },
    showPopup(modalName) {
      $(modalName).modal('show')
    },
  },
  computed: {
    ...mapGetters('context', ['store']),
    ...mapGetters('auth', ['waiter', 'carhop', 'allowed']),
    ...mapState({
      user: state => state.auth.userDetails.item,
      role: state => state.auth.role,
      collectedData: state =>
        state.auth.userDetails.collected_data
          ? state.auth.userDetails.collected_data
          : '',
      rootStore: state =>
        state.auth.userDetails.collected_data
          ? state.auth.userDetails.collected_data.page_lookups.root_stores
          : state.location.brandStores,
      rootBrandRoles: state =>
        state.auth.userDetails.collected_data
          ? state.auth.userDetails.collected_data.page_lookups.root_brand_roles
          : '',
      brands: state =>
        state.auth.userDetails.collected_data
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
  display: flex;
  grid-row-start: 2;
  grid-column-start: 2;
  grid-column-end: 3;
}
.profile-brand-container {
  max-width: 60%;
}
.profile-container {
  max-width: 65%;
}
.profile-container,
.profile-brand-container {
  box-shadow: none;
  border: 1px solid blue;
}
#dm-content-wrapper {
  margin-top: 2%;
}
.btn-success {
  height: 3.125rem;
  font-size: 0.875rem;
  left: 45vh;
  margin-right: 2rem;
}
</style>
