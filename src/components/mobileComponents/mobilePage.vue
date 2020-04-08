<template>
  <div class="mobile-page">
    <div class="mobile-header">
      <btnBack
        v-if="foodMenuHendler || subCategoryHendler"
        :param="navigateTo"
      />
      <div v-else></div>
      <div class="current-sale">
        <div class="title">Current Sale ({{ _t(orderType.OTview) }})</div>
        <div class="list">
          <div class="items" v-if="items[items.length - 1]">
            <div class="items-text">{{ items[items.length - 1].name }}</div>
            <div class="items-num">x{{ items[items.length - 1].quantity }}</div>
          </div>
        </div>
      </div>
      <div class="btn-menu" @click="profileHendlerChange">
        <svg
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="25px"
          height="25px"
          viewBox="0 0 124 124"
          style="enable-background:new 0 0 25 25;"
          xml:space="preserve"
        >
          <path
            d="M112,6H12C5.4,6,0,11.4,0,18s5.4,12,12,12h100c6.6,0,12-5.4,12-12S118.6,6,112,6z"
          />
          <path
            d="M112,50H12C5.4,50,0,55.4,0,62c0,6.6,5.4,12,12,12h100c6.6,0,12-5.4,12-12C124,55.4,118.6,50,112,50z"
          />
          <path
            d="M112,94H12c-6.6,0-12,5.4-12,12s5.4,12,12,12h100c6.6,0,12-5.4,12-12S118.6,94,112,94z"
          />
        </svg>
      </div>
    </div>
    <div class="mobile-search">
      <search />
    </div>
    <div class="mobile-body">
      <posmenu />
      <submenu />
      <items />
    </div>
    <mobile-footer />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import search from '../pos/content/catalog/Search.vue'
import submenu from '../pos/content/catalog/SubMenu.vue'
import posmenu from '../pos/Menu.vue'
import items from '../pos/content/catalog/Items.vue'
import mobileFooter from './mobileFooter.vue'
import btnBack from '../mobileComponents/mobileElements/btnBack'

export default {
  components: {
    search,
    posmenu,
    submenu,
    items,
    mobileFooter,
    btnBack,
  },
  computed: {
    ...mapGetters('order', ['items']),
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['orderType']),
    ...mapGetters([
      'allCategoryHendler',
      'subCategoryHendler',
      'foodMenuHendler',
    ]),
    navigateTo() {
      if (this.allCategoryHendler) {
        return 'category'
      }
      if (this.subCategoryHendler) {
        return 'subcategory'
      }
      return 'item'
    },
  },
  methods: {
    profileHendlerChange() {
      this.$store.dispatch('profileHendlerChange')
    },
    footerMenuHendlerChange() {
      this.$store.dispatch('footerMenuHendlerChange')
    },
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.mobile-page {
  background-color: #fff;
  height: 100%;
  display: grid;
  grid-template-rows: max-content 55px 1fr max-content;

  .mobile-header {
    padding: 10px 0px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fafafa;
    z-index: 2;

    .current-sale {
      .title {
        font-size: 24px;
        line-height: 27px;
        font-weight: 600;
        margin-bottom: 5px;
      }

      .list {
        display: flex;
        width: 70vw;
        overflow: auto;
        white-space: nowrap;
        text-overflow: ellipsis;

        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        .items {
          display: grid;
          grid-template-columns: max-content max-content;
          align-items: center;
          margin-right: 10px;

          .items-text {
            margin-right: 10px;
            height: 25px;
            display: flex;
            align-items: center;
          }

          .items-num {
            min-width: 20px;
            min-height: 20px;
            background-color: $green-middle;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: 600;
            border-radius: $btn-border-radius;
            font-size: 12px;
            padding: 3px 5px;
          }
        }
      }
    }

    .btn-menu {
      width: 50px;
      height: 50px;
      @include responsive(mobile) {
        margin-right: 10px;
      }
      /*background-color: $btn-bg-black;*/
      background: linear-gradient(
        0deg,
        rgb(230, 225, 225) 0%,
        rgb(236, 232, 232) 100%
      );
      border-radius: $btn-border-radius;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .mobile-search {
    border-top: 1px solid #e3e7f2;
    border-bottom: 1px solid #e3e7f2;
    padding: 5px 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1;
    background: linear-gradient(90deg, #e6e6e8 0%, #dfdfe0 35%, #eaeeef 100%);
  }

  .mobile-body {
    overflow: hidden;
    position: relative;
    background-color: #fafafa;
    .navigation
      .navigation-list-wrapper
      .navigation-list
      .nav-item
      .nav-link-nav.active,
    .navigation
      .navigation-list-wrapper
      .navigation-list
      .nav-item
      .nav-link-nav:hover {
      background-color: rgba(158, 158, 158, 0.1) !important;
    }
  }

  .mobile-footer {
    z-index: 1;
    .btn-next {
      display: none;
    }
  }
}
</style>
