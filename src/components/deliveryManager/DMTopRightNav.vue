<template>
  <div class="page-header">
    <div class="current-time">
      <span class="date">July 2nd 2019</span>&nbsp;&nbsp;&nbsp;
      <span class="time">11:09:08 AM</span>
    </div>
    <div class="button-block">
      <div class="change-location">
        <button class="btn btn-success">Change Brand</button>
        <button class="btn btn-success walkin-btn">
          <router-link :to="store" class="text-white">Walk-in</router-link>
        </button>
      </div>
      <div class="lang-selector">
        <div class="v-menu v-menu--inline">
          <div class="v-menu__activator">
            <button type="button" class="v-btn v-btn--icon theme--light">
              <div class="v-btn__content">
                <div class="lang-flag-container">
                  <img src="/img/icons/us.svg" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'DMTopRightNav',
  computed: {
    ...mapGetters('context', ['store']),
  },
}
</script>
