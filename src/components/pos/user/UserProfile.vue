<template>
  <div class="modal fade" id="user-details" role="dialog">
    <div class="modal-dialog" v-if="user">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('User Details') }}
          </h4>
          <span data-dismiss="modal" class="cursor-pointer">X</span>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div class="profile-content">
            <div class="profile-container">
              <div class="profile-picture-container">
                <img
                  :src="
                    user.avatar ? user.avatar : 'img/profile/default_avatar.jpg'
                  "
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

                <span class="caption">{{ _t('User Type') }}:</span
                ><span>Regular</span>
              </div>
            </div>
            <div class="delimiter">&nbsp;</div>
            <div class="profile-brand-container">
              <div class="items">
                <span class="caption">{{ _t('Associated Brand') }}:</span>
                <span>
                  {{
                    LookupData.get({
                      collection: brands._id,
                      matchWith: user.brand_id,
                      selection: 'name',
                    })
                  }}
                </span>

                <span class="caption">{{ _t('Associated Brand Role') }}:</span>
                <span>
                  {{
                    LookupData.get({
                      collection: rootBrandRoles._id,
                      matchWith: user.brand_role,
                      selection: 'name',
                    })
                  }}
                </span>
                <span class="caption">{{ _t('Has Access to') }}:</span>
                <span>
                  <span v-for="storeId in user.brand_stores" :key="storeId">
                    {{
                      LookupData.get({
                        collection: rootStore._id,
                        matchWith: storeId,
                        selection: 'name',
                      })
                    }},
                  </span>
                </span>
              </div>
              <div class="buttons"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <!--<router-link
            :to="'/cashier-login' + store"
            v-if="enabledModule('switchCashier')"
          >
            <button
              id="switch-user-btn-profile"
              type="button"
              class="btn btn-danger cancel-announce color-icon-table-neutral-button font-weight-bold"
            >
              {{ _t('Switch Cashier') }}
            </button>
          </router-link>-->

          <button
            type="button"
            class="btn btn-danger cancel-announce color-icon-table-neutral-button font-weight-bold logout"
            @click="logout()"
          >
            {{ _t('Logout') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateTime from '@/mixins/DateTime'

import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  name: 'UserProfile',
  mixins: [DateTime],
  methods: {
    ...mapActions('auth', ['logout']),
    enabledModule(option) {
      switch (option) {
        case 'switchCashier':
          return false
      }
    },
  },
  computed: {
    ...mapGetters('context', ['store']),
    ...mapState({
      user: state => state.auth.userDetails.item,
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

#switch-user-btn-profile {
  background: $blue-light;
  border-color: $blue-light;
}
</style>
