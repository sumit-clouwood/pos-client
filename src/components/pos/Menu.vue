<template>
  <div
    :class="['navigation', allCategoryHendler ? 'active' : 'notActive']"
    class="color-main"
  >
    <div class="logo" title="logo">
      <a class="logo-link" href="javascript:void(0)">
        <!--<router-link :to="'/delivery-manager' + store">-->
        <img src="img/icons/icon.png" alt="icon" />
        <!--</router-link>-->
      </a>
    </div>
    <div class="navigation-list-wrapper">
      <btnBack />
      <ul class="navigation-list" v-if="categories.length">
        <li
          class="nav-item active-opacity color-text-invert"
          v-for="item in categories"
          :key="item._id"
          :title="dt(item)"
          :data-original-title="dt(item)"
          @click="subCategoryHendlerChange"
        >
          <a
            class="nav-link-nav color-text-invert"
            :class="{ active: currentCategory === item._id }"
            :style="{
              background: item.category_image == '' ? item.category_color : '',
            }"
            @click.prevent="browse(item)"
          >
            <img
              v-if="item.category_image != ''"
              :src="item.category_image"
              :alt="dt(item)"
            />
            <span class="nav-link-text">{{ dt(item) }}</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="slider-btn color-secondary" @click="showMore">
      <i class="fa fa-chevron-down color-text-invert" aria-hidden="true"></i>
    </div>
    <div
      class="navigation-avatar color-secondary"
      v-if="userDetails"
      data-toggle="modal"
      data-target="#user-details"
      data-dismiss="modal"
    >
      <a
        class="nav-link"
        href="javascript:void(0)"
        :title="userDetails.item.name"
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
          {{ userDetails.item.name }}
        </div>
      </a>
    </div>
    <div v-if="getImages">
      <link
        v-for="(url, key) in getImages"
        rel="prefetch"
        :href="url"
        :key="key"
      />
    </div>
    <div v-if="modifierImages">
      <link
        v-for="(url, key) in modifierImages"
        rel="prefetch"
        :href="url"
        :key="key"
      />
    </div>
  </div>
</template>

<script>
/* global  $, menuShowMore*/
import bootstrap from '@/bootstrap'
import btnBack from '../mobileComponents/mobileElements/btnBack'

import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'Menu',
  components: {
    btnBack,
  },
  computed: {
    ...mapState({
      currentCategory: state => state.category.category._id,
    }),
    ...mapGetters('context', ['store']),
    ...mapState('auth', ['userDetails']),
    ...mapGetters(['allCategoryHendler', 'subCategoryHendler']),
    ...mapGetters('category', ['categories', 'getImages']),
    ...mapGetters('modifier', {
      modifierImages: 'getImages',
    }), //to preftech modifier images, todo
  },
  methods: {
    browse(item) {
      // eslint-disable-next-line no-undef
      $('.breadcrumbs').show()
      $('.search-field-input').val('')
      this.$store.commit('sync/reload', true)
      bootstrap.loadUI().then(() => {})
      this.$store.dispatch('category/browse', item)
    },
    showMore() {
      menuShowMore()
    },
    ...mapActions('category', ['browse']),
    subCategoryHendlerChange() {
      this.$store.dispatch('subCategoryHendlerChange')
    },
  },
  updated() {
    $('li.nav-item.arrow-bottom > a > .bt-arrow').click(function(e) {
      e.preventDefault()
      let menuHeight = 0
      $('#menuAccordion li').each(function() {
        menuHeight = menuHeight + $(this).innerHeight()
      })
      let accordionHeight = $('#menuAccordion').innerHeight()
      if (menuHeight > accordionHeight) {
        $('#menuAccordion')
          .stop()
          .animate({ top: accordionHeight - (menuHeight + 60) + 'px' }, 800)
      } else {
        $('.top-arrow').css('display', 'none')
      }
      $('.bt-arrow').css('display', 'none')
      $('.top-arrow').css('display', 'block')
      return false
    }),
      $('li.nav-item.arrow-bottom > a > .top-arrow').click(function(e) {
        e.preventDefault()
        $('#menuAccordion')
          .stop()
          .animate({ top: 0 + 'px' }, 800)
        $('.bt-arrow').css('display', 'block')
        $('.top-arrow').css('display', 'none')
        return false
      })
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/pixels_rem.scss';
@import '../../assets/scss/variables.scss';
@import '../../assets/scss/mixins.scss';

.category {
  a {
    cursor: pointer;
  }

  img {
    height: 25px;
    margin-top: 8px;
  }
}

@include responsive(mobile) {
  .navigation {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background-color: transparent;
    grid-template-rows: max-content;
    z-index: 1;
    overflow: hidden;
    grid-row-start: 3;
    grid-row-end: 4;

    &.active {
      transition: 0.7s ease-out;
    }

    &.notActive {
      top: -100%;
      transition: 0.7s ease-out;
    }

    .logo {
      display: none;
    }

    .slider-btn {
      display: none;
    }

    .navigation-avatar {
      display: none;
    }

    .navigation-list-wrapper {
      overflow: auto;
      height: 100%;
      position: absolute;
      right: 0;
      left: 0;

      &::-webkit-scrollbar {
        width: 8px;
      }

      .navigation-list {
        overflow: auto;
        grid-gap: 0;
        padding: 0;

        .nav-item {
          grid-template-columns: 1fr;
          background-color: #fafafa;

          .nav-link-nav {
            color: #333;
            width: auto;
            height: 65px;
            flex-direction: row;
            justify-content: flex-start;
            border-bottom: 1px solid $gray-middle;
            padding: 0 20px 0 0px;
            display: grid;
            grid-template-columns: min-content 1fr;
            grid-gap: 20px;
            background-color: #fff !important;

            .nav-link-text {
              font-size: 14px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: left;
            }

            img {
              width: 64px;
              height: 64px;
              margin-bottom: 0;
              border-radius: 0;
              margin: 0;
            }

            &.active {
              background-color: transparent;
              box-shadow: none;
            }
          }
        }
      }
    }
  }
}
</style>
