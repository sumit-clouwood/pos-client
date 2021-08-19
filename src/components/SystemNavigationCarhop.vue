<template>
  <div class="navigation toggle-navigation">
    <div class="logo" @click="collapseExpend">
      <a class="logo-link" role="button">
        <img
          src="https://d3jjfdwi6rnqlf.cloudfront.net/img/other/icon.png"
          alt="icon"
        />
      </a>
    </div>
    <div class="navigation-list-wrapper">
      <ul class="navigation-list">
        <li
          class="nav-item active-opacity"
          data-toggle="tooltip"
          data-placement="right"
          :title="_t('Carhop')"
        >
          <a class="nav-link-nav" @click.prevent="gotoCarhop">
            <div class="nav-link-text">
              <svg id="menu_menu_icon" viewBox="0 0 24 20">
                <g fill="" fill-rule="nonzero">
                  <path
                    d="M.878 15.951h22.244c.498 0 .878-.38.878-.878a.862.862 0 0 0-.878-.878h-.263c-.322-4.449-3.747-8.107-8.254-9.16.38-.498.615-1.142.615-1.815a3.073 3.073 0 1 0-6.147 0c0 .643.205 1.258.556 1.756-4.624.965-8.166 4.683-8.488 9.22H.878a.862.862 0 0 0-.878.877c0 .498.38.878.878.878zM12.146 1.902c.732 0 1.317.586 1.317 1.318 0 .731-.585 1.317-1.317 1.317A1.312 1.312 0 0 1 10.83 3.22c0-.732.586-1.318 1.317-1.318zM23.122 18H.878a.862.862 0 0 0-.878.878c0 .498.38.878.878.878h22.244c.498 0 .878-.38.878-.878a.862.862 0 0 0-.878-.878z"
                  ></path>
                </g>
              </svg>
            </div>
            <span class="nav-link-name">{{ _t('Carhop') }}</span>
            <!-- <span class="nav-link-text"></span> -->
          </a>
        </li>
      </ul>
    </div>
    <div class="slider-btn" @click="showMore">
      <i aria-hidden="true" class="fa fa-chevron-down"></i>
    </div>
    <router-link
      class="navigation-avatar color-secondary"
      v-if="userDetails && permitted('profile', 'root')"
      :to="'/user-details' + store"
    >
      <a
        class="nav-link"
        role="button"
        :title="userDetails.item ? userDetails.item.name : ''"
      >
        <img
          v-if="typeof userDetails.item != 'undefined'"
          :src="
            userDetails.item.avatar
              ? userDetails.item.avatar
              : 'img/profile/default_avatar.jpg'
          "
          alt="profile"
        />
        <div class="nav-link-user-name color-text-invert">
          {{ userDetails.item ? userDetails.item.name : '' }}
        </div>
      </a>
    </router-link>
    <!--top Menu-->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
/* global $, menuShowMore */
export default {
  name: 'SystemNavigation',
  methods: {
    gotoCarhop() {
      this.$router.replace({ name: 'Carhop' })
    },
    collapseExpend() {
      $('.navigation').toggleClass('collapse-menu')
      $('.toggle-nav-content').toggleClass('collapse-container')
    },
    showMore() {
      menuShowMore()
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters('location', ['_t', 'permitted']),
    ...mapGetters('context', ['store']),
    ...mapState('auth', ['userDetails']),
  },
}
</script>

<style scoped></style>
