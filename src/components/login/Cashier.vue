<template>
  <div class="cashierlogin">
    <div class="user-list">
      <div class="title">Please Select User</div>
      <div class="user-grid">
        <user
          v-for="(user, key) in testUsers"
          :key="key"
          :param="user"
          @click.native="openUser(user)"
        />
      </div>
    </div>

    <div :class="['user-login', { active: true }]">
      <div class="cashier-list-header">
        <user :param="user" />
      </div>
      <div class="cashier-list-body"></div>
      <div class="cashier-list-footer">
        <date-time />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dateTime from '@/components/mobileComponents/mobileElements/dateTime.vue'
import user from './User'

export default {
  name: 'cashierList',
  data() {
    return {
      user: '',
      userPin: [],
      userKey: null,
    }
  },
  computed: {
    ...mapGetters(['testUsers']),
  },
  components: {
    dateTime,
    user,
  },
  methods: {},
}
</script>

<style lang="sass" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.cashierlogin
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  color: #fff;
  z-index: 1060;
  font-size: 20px;
  opacity: 0.61;
  background-color: #212121;

.user-grid
  border: 1px solid red
  display: grid
  justify-content: center
  grid-auto-rows: 150px /*size of row */
  grid-gap: 10px
  grid-template-columns: repeat(auto-fill, 200px)

  .user
    border: 1px solid #f00
</style>
