<template>
  <div class="login-background-wrapper login-page">
    <div class="before-login-wrapper">
      <div class="dimension-logo">
        <img src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/logo.png" />
      </div>
      <div
        :class="[
          'login-container-container',
          login_fail_message || login_success_message ? 'message-shown' : '',
          login_in_progress ? 'in-progress-shown' : '',
        ]"
      >
        <div class="login-container">
          <div class="login-title login-top">Login</div>
          <div class="login-body">
            <form class="login" @submit.prevent="login">
              <label>Email</label>
              <input
                required
                v-model="email"
                type="email"
                class="login-input"
                value
                :placeholder="_t('Email Address')"
              />
              <label>Password</label>
              <input
                required
                v-model="password"
                class="login-input"
                value
                type="password"
                :placeholder="_t('Password')"
              />
              <div class="row">
                <div class="col-6"></div>
                <div class="col-6 align-right">
                  <button type="submit" class="btn btn-flow btn-default">
                    <span>Log-in</span>
                  </button>
                </div>
              </div>
              <div class="progress-container" v-if="login_in_progress">
                <Progress />
              </div>
              <div
                v-if="login_fail_message || login_success_message"
                class="alert fade show"
                :class="
                  login_fail_message
                    ? 'alert-danger'
                    : login_success_message
                    ? 'alert-success'
                    : ''
                "
                role="alert"
              >
                {{
                  login_fail_message
                    ? login_fail_message
                    : login_success_message
                    ? login_success_message
                    : ''
                }}
              </div>
            </form>
          </div>
          <div class="login-title login-bottom">
            <!-- <router-link :to="{ name: 'forgot_password' }">
              Forgot your password?
            </router-link>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Progress from '@/components/util/Progress'
import DataService from '@/services/DataService'

export default {
  computed: {
    ...mapGetters('location', ['_t']),
  },
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      login_in_progress: false,
      login_success_message: false,
      login_fail_message: false,
    }
  },
  components: {
    Progress,
  },
  methods: {
    login: function() {
      if (this.login_in_progress == false) {
        this.login_in_progress = true
        this.login_success_message = ''
        this.login_fail_message = ''

        //reset context only when there is no brand/store id in login
        if (!this.$route.params.brand_id) {
          this.$store.commit('context/RESET', null, { root: true })
          DataService.setContext({
            brand: this.$store.getters['context/brand'],
            store: this.$store.getters['context/store'],
          })
        }

        this.$store
          .dispatch('auth/login', {
            email: this.email,
            password: this.password,
          })
          .then(token => {
            this.login_success_message = 'Logged in successfully.'
            this.$store.commit('auth/SET_TOKEN', token)
          })
          .catch(error => {
            this.login_fail_message = error
          })
          .finally(() => {
            this.login_in_progress = false
          })
      }
    },
  },
}
</script>
