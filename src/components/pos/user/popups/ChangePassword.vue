<template>
  <div
    id="password-modal"
    class="modal fade"
    role="dialog"
    data-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header" style="background-color: rgb(245, 245, 245)">
          <h4 class="modal-title">{{ _t('Change Password') }}</h4>
        </div>
        <div class="modal-body">
          <form>
            <div class="upper-div">
              <div class="icon-div">
                <input
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="off"
                  class="field-input"
                  :placeholder="_t('Password')"
                  v-model="password"
                  required
                />
                <span @click.prevent="showPassword = !showPassword">
                  <i
                    :class="
                      showPassword ? 'fa fa-eye fa-lg' : 'fa fa-eye-slash fa-lg'
                    "
                    aria-hidden="true"
                  ></i>
                </span>
              </div>

              <div class="icon-div">
                <input
                  name="swipe-card"
                  maxlength="4"
                  minlength="4"
                  :type="showSwipeCard ? 'text' : 'password'"
                  autocomplete="off"
                  class="field-input"
                  :placeholder="_t('Swipe Card')"
                  v-model="swipeCard"
                  required
                />
                <span @click.prevent="showSwipeCard = !showSwipeCard">
                  <i
                    :class="
                      showSwipeCard
                        ? 'fa fa-eye fa-lg'
                        : 'fa fa-eye-slash fa-lg'
                    "
                    aria-hidden="true"
                  ></i>
                </span>
              </div>
            </div>
            <div class="lower-div">
              <div class="icon-div">
                <input
                  name="repeat-password"
                  :type="showRepeatPassword ? 'text' : 'password'"
                  autocomplete="off"
                  class="field-input"
                  :placeholder="_t('Repeat Password')"
                  v-model="repeatPassword"
                  required
                />
                <span @click.prevent="showRepeatPassword = !showRepeatPassword">
                  <i
                    :class="
                      showRepeatPassword
                        ? 'fa fa-eye fa-lg'
                        : 'fa fa-eye-slash fa-lg'
                    "
                    aria-hidden="true"
                  ></i>
                </span>
              </div>

              <div class="icon-div">
                <input
                  name="repeat-swipe-card"
                  :type="showRepeatSwipeCard ? 'text' : 'password'"
                  minlength="4"
                  maxlength="4"
                  autocomplete="off"
                  class="field-input"
                  :placeholder="_t('Repeat Swipe Card')"
                  v-model="repeatSwipeCard"
                  required
                />
                <span
                  @click.prevent="showRepeatSwipeCard = !showRepeatSwipeCard"
                >
                  <i
                    :class="
                      showRepeatSwipeCard
                        ? 'fa fa-eye fa-lg'
                        : 'fa fa-eye-slash fa-lg'
                    "
                    aria-hidden="true"
                  ></i>
                </span>
              </div>
            </div>
          </form>
        </div>
        <div class="errors" v-for="(error, index) in formErrors" :key="index">
          <span class="error">{{ error }}</span>
        </div>
        <div
          class="modal-footer"
          style="
          justify-content: flex-end;  
          padding-bottom: 0.5rem; 
          padding-right: 0.5rem;"
        >
          <button
            type="button"
            @click="changePassword()"
            class="btn btn-success"
          >
            {{ _t('Submit') }}
          </button>
          <button type="button" class="btn btn-danger" @click="resetForm()">
            {{ _t('Close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* global $ */
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      changePasswordInProgress: false,
      password: null,
      repeatPassword: null,
      swipeCard: null,
      repeatSwipeCard: null,
      errors: [],
      showPassword: false,
      showRepeatPassword: false,
      showSwipeCard: false,
      showRepeatSwipeCard: false,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    formErrors() {
      return this.errors
    },
  },
  methods: {
    changePassword() {
      this.errors = []
      if (this.validateForm()) {
        if (!this.changePasswordInProgress) {
          this.changePasswordInProgress = true
          this.$store
            .dispatch('auth/changePassword', {
              password: this.password,
              repeat_password: this.repeatPassword,
              swipe_card: this.swipeCard,
              repeat_swipe_card: this.repeatSwipeCard,
            })
            .then(() => {
              this.resetForm()
            })
            .catch(error => {
              this.changePasswordInProgress = false
              this.errors = error
            })
        }
      }
    },
    validateForm() {
      this.errors = []
      if (
        this.password &&
        this.repeatPassword &&
        this.swipeCard &&
        this.repeatSwipeCard
      ) {
        if (this.password != this.repeatPassword) {
          this.errors.push('Passwords must match')
          this.changePasswordInProgress = false
          return false
        }
        if (this.swipeCard.length != 4 || this.repeatSwipeCard.length != 4) {
          this.errors.push('Swipe Card Number must be 4 digits')
          this.changePasswordInProgress = false
          return false
        }
        if (this.swipeCard != this.repeatSwipeCard) {
          this.errors.push('Swipe Card Number must match')
          this.changePasswordInProgress = false
          return false
        }
        this.errors = []
        this.changePasswordInProgress = false
        return true
      }
      this.errors.push('All fields are required')
      return false
    },
    resetForm() {
      this.changePasswordInProgress = false
      this.password = ''
      this.repeatPassword = ''
      this.swipeCard = ''
      this.repeatSwipeCard = ''
      this.showPassword = false
      this.showRepeatPassword = false
      this.showSwipeCard = false
      this.showRepeatSwipeCard = false
      this.error = []
      $('#password-modal').modal('hide')
    },
  },
}
</script>
<style lang="scss" scoped>
.fa {
  margin-left: -70px;
  color: rgba(63, 74, 74, 0.8);
  border: none;
  padding: 12px 16px;
  font-size: 16px;
  cursor: pointer;
}
.error {
  color: red;
  font-family: 'ProximaNova-Regular';
  font-size: 12px;
  margin-left: 4rem;
}
.icon-div {
  align-items: flex-end;
  margin-right: 5rem;
  margin-left: 2rem;
}
.upper-div,
.lower-div {
  display: flex;
  justify-content: space-between;
}
input {
  width: 500px;
  margin-top: 2rem;
  margin-right: 2rem;
}
.modal-body {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: inherit;
  display: flex;
  padding: 0px;
  min-height: inherit;
  position: relative;
  -webkit-transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  width: 100%;
}
.modal-title {
  font-weight: 500;
}
.modal-footer {
  margin-top: 2rem;
  border-top: 1px solid rgba(63, 74, 74, 0.1);
}
.btn-danger {
  margin-left: 21px;
  height: 3.1875rem;
  background: #cc3232;
  color: white;
  width: 10%;
  border: none;
  font-size: 12.75px;
}
.btn-success {
  height: 3.1875rem;
  color: white;
  width: 10%;
  border: none;
  font-size: 12.75px;
}
.modal-header {
  flex-direction: row;
  background-color: rgb(245, 245, 245);
}
.modal-dialog {
  max-width: 90% !important;
  min-height: 80% !important;
}

.field-input {
  font-family: 'ProximaNova-Regular';
  font-size: 16px;
  height: 2.5em;
  border: none;
  border-bottom: 1px solid rgba(63, 74, 74, 0.1);
  padding: 1rem;
}
.btn {
  margin-top: 2rem;
}
</style>
