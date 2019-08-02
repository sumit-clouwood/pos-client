<template>
  <div class="login-background-wrapper login-page">
    <div class="before-login-wrapper">
      <div class="dimension-logo">
        <img src="/img/logo.png" />
      </div>
      <div
        :class="[
          'login-container-container',
          login_fail_message || login_success_message ? 'message-shown' : '',
          login_in_progress ? 'in-progress-shown' : '',
        ]"
      >
        <div class="login-container">
          <div class="login-title login-top">{{ _t('Login') }}</div>
          <div class="login-body">
            <form class="login" @submit.prevent="login">
              <label>{{ _t('Email') }}</label>
              <input
                required
                v-model="email"
                type="email"
                class="login-input"
                value=""
                :placeholder="_t('Email Address')"
              />
              <label>{{ _t('Password') }}</label>
              <input
                required
                v-model="password"
                class="login-input"
                value=""
                type="password"
                :placeholder="_t('Password')"
              />
              <div class="row">
                <div class="col-6"></div>
                <div class="col-6 align-right">
                  <button type="submit" class="btn btn-flow btn-default">
                    <span>{{ _t('Log-in') }}</span>
                  </button>
                </div>
              </div>
              <div class="progress-container" v-if="login_in_progress">
                <v-progress-linear :indeterminate="true"></v-progress-linear>
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
            <router-link :to="{ name: 'forgot_password' }">
              {{ _t('Forgot your password?') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'login_success_message',
      'login_fail_message',
      'login_in_progress',
    ]),
    ...mapGetters('location', '_t'),
  },
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login: function() {
      if (this.login_in_progress == false) {
        this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password,
        })
      }
    },
  },
}
</script>
