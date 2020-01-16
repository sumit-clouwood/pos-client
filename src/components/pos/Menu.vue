<template>
  <div
    :class="['navigation', allCategoryHendler ? 'active' : 'notActive']"
    class="color-main"
  >
    <div class="logo" title="logo">
      <a class="logo-link" role="button">
        <!--<router-link :to="'/delivery-manager' + store">-->
        <img src="img/icons/icon.png" alt="icon" />
        <!--</router-link>-->
      </a>
    </div>
    <div class="navigation-list-wrapper">
      <!--<btnBack :param="'category'" />-->
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
            :class="[
              { active: currentCategory === item._id },
              item.category_image ? '' : 'activebg',
            ]"
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
    <router-link
      class="navigation-avatar color-secondary"
      v-if="userDetails.item"
      :to="'/user-details' + store"
    >
      <a class="nav-link" role="button" :title="userDetails.item.name">
        <img
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
    </router-link>
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
/* global  $ */
//import bootstrap from '@/bootstrap'
// import btnBack from '../mobileComponents/mobileElements/btnBack'

import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Menu',
  data() {
    return {
      menuItemHeight: 0,
      menuHeight: 0,
      menuInitHeight: 0,
    }
  },
  components: {
    // btnBack,
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
  updated() {
    let menuHeight = $('.navigation-list-wrapper').innerHeight()
    this.menuHeight = menuHeight
    this.menuInitHeight = menuHeight
    this.menuItemHeight = $('.navigation-list').innerHeight()
  },
  methods: {
    browse(item) {
      // eslint-disable-next-line no-undef
      $('.breadcrumbs').show()
      $('.search-field-input').val('')
      //bootstrap.loadUI().then(() => {})
      this.$store.dispatch('category/browse', item)
    },
    showMore() {
      // menuShowMore()
      this.menuHeight += parseInt(this.menuInitHeight)
      //alert(this.cartHeight + ' << ' + this.cartItemHeight)
      if (this.menuHeight >= this.menuItemHeight) {
        $('.slider-btn').removeClass('toggle')
        this.menuHeight = 0
        $('.navigation-list-wrapper').animate(
          { scrollTop: this.menuHeight },
          1000
        )
        return false
      }
      $('.slider-btn').addClass('toggle')
      $('.navigation-list-wrapper').animate(
        { scrollTop: this.menuHeight },
        1000
      )
    },
    subCategoryHendlerChange() {
      this.$store.dispatch('category/collectSearchItems', '')
      //this.$store.dispatch('subCategoryHendlerChange')
    },
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
      .back {
        display: none;
      }

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
            height: 4rem;
            min-height: auto;
            flex-direction: row;
            justify-content: flex-start;
            border-bottom: 1px solid $gray-middle;
            padding: 0 20px 0 10px;
            display: grid;
            grid-template-columns: min-content 1fr;
            cursor: pointer;
            background-color: #fff;

            .nav-link-text {
              font-size: 14px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: left;
              justify-content: flex-start;
              margin-left: 20px;
            }

            img {
              width: 3rem;
              height: 3rem;
              margin-bottom: 0;
              border-radius: 2px;
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
