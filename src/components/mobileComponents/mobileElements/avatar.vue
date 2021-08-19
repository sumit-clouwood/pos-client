<template>
  <div class="avatar">
    <router-link
      class="avatar-link"
      :title="user ? user.name : ''"
      :to="!isMobile ? '/user-details' + currentStore : ''"
    >
      <!--<img class="avatar-link-img" :src="profileImage" alt="profile" />-->
      <img
        class="avatar-link-img"
        :src="
          user && user.avatar
            ? user.avatar
            : 'https://d3jjfdwi6rnqlf.cloudfront.net/img/profile/default_avatar.jpg'
        "
        alt="profile"
      />
      <label class="avatar-link-user" :title="user ? user.name : ''">
        {{ isMobile ? userName : user.name }}
      </label>
      <status />
    </router-link>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import status from './status.vue'

export default {
  name: 'Avatar',
  components: {
    status,
  },
  computed: {
    userName() {
      return this.user ? this.user.name : ''
    },
    isMobile() {
      return this.$store.state.mobile.device === 'mobile'
    },
    // ...mapState({
    //   profileImage: state =>
    //     state.auth.userDetails && state.auth.userDetails.image
    //       ? process.env.VUE_APP_API_ENDPOINT +
    //         '/profile_pic/' +
    //         state.auth.userDetails.image
    //       : 'img/pos/profile-pic.png',
    // }),
    ...mapState({
      user: state => state.auth.userDetails.item,
    }),
    ...mapGetters({
      currentStore: ['context/store'],
    }),
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.avatar {
  grid-column-start: 1;
  grid-column-end: 3;
  .avatar-link {
    display: grid;
    grid-template-columns: max-content max-content;

    .avatar-link-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 20px;
      grid-row-start: 1;
      grid-row-end: 3;
      @include responsive(mobile) {
        width: 51px;
        height: 48px;
        margin-right: 9px;
      }
    }

    .avatar-link-user {
      font-size: 1.2rem;
      line-height: 20px;
      font-weight: 600;
      color: #4b4e53;
      &:hover {
        cursor: pointer;
      }
      @include responsive(mobile) {
        text-transform: capitalize;
        font-size: 1rem;
      }
    }
  }
}
</style>
