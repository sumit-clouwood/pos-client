<template>
  <div class="modal-content lockpad">
    <div class="modal-header">
      <input
        type="password"
        placeholder="Enter PIN"
        name="PIN"
        id="cashierpin"
        v-model="pincode"
        :maxlength="pincodeLength"
        autofocus
      />
      <button class="unlock" @click="login" :disabled="processing">
        Unlock
      </button>
    </div>
    <div class="progress-container" v-show="processing">
      <Progress />
    </div>
    <transition name="errortrans">
      <div class="text-danger" v-show="showError">
        {{ error }}
      </div>
    </transition>
    <div class="modal-body-digits" @click="addDigit">
      <div class="dig number-dig num">1</div>
      <div class="dig number-dig num">2</div>
      <div class="dig number-dig num">3</div>
      <div class="dig number-dig num">4</div>
      <div class="dig number-dig num">5</div>
      <div class="dig number-dig num">6</div>
      <div class="dig number-dig num">7</div>
      <div class="dig number-dig num">8</div>
      <div class="dig number-dig num">9</div>
      <div class="dig number-dig num blank"></div>
      <div class="dig number-dig num">0</div>
      <div class="dig number-dig rem" id="backspace">
        <img src="~@/assets/images/close.png" class="rem" alt="back" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import Progress from '@/components/util/Progress'
import md5 from 'js-md5'
export default {
  name: 'Lockpad',
  data() {
    return {
      error: false,
      showError: false,
      pincode: '',
      pincodeLength: 4,
      processing: false,
      brand_id: false,
      store_id: false,
      storeUrl: false,
    }
  },
  computed: {
    ...mapGetters('context', ['store']),
    ...mapState('context', ['brandId', 'storeId']),
    ...mapState('sync', ['online']),
    ...mapGetters('sync', ['loadingData']),
    ...mapActions('auth', ['filterUserInOffline']),
  },
  components: { Progress },
  methods: {
    addDigit(event) {
      if (event.target.classList.contains('num')) {
        if (this.pincode.length < this.pincodeLength) {
          this.pincode = this.pincode.concat(event.target.innerHTML)
        }
      } else if (event.target.classList.contains('rem')) {
        this.pincode = this.pincode.substr(0, this.pincode.length - 1)
      }
    },
    loginOffline() {
      this.$store
        .dispatch('auth/filterUserInOffline', md5(this.pincode))
        .then(user => {
          if (user) {
            this.$router.replace({
              name: 'BrandHome',
              params: {
                brand_id: this.brandId,
                store_id: this.storeId,
              },
            })
            localStorage.setItem('offline_mode_login', true)
            this.$store.commit('auth/SET_OFFLINE_PIN', this.pincode)
            this.$store.commit('sync/status', false)
          }
        })
        .catch(error => {
          this.error = error
          this.showError = true
          this.pincode = ''
          setTimeout(() => {
            this.showError = false
          }, 3000)
        })
        .finally(() => {
          this.processing = false
        })
    },
    // loadCompleteUi() {
    //   this.$store.dispatch('auth/resetModules')

    //   // eslint-disable-next-line no-console
    //   console.log('user', this.$store.state.auth.userDetails.item)
    //   const storeId = this.$store.state.auth.userDetails.item.brand_stores[0]
    //   if (storeId) {
    //     this.$store.commit('context/SET_STORE_ID', storeId, {
    //       root: true,
    //     })
    //     localStorage.setItem('store_id', storeId)

    //     DataService.setContext({
    //       brand: this.$store.getters['context/brand'],
    //       store: this.$store.getters['context/store'],
    //     })
    //   }

    //   bootstrap
    //     .loadUI('sw')
    //     .then(() => {
    //       this.$store.dispatch('checkout/reset', true)

    //       bootstrap.loadApiData('customer')

    //       bootstrap.loadApiData('order')

    //       localStorage.setItem('offline_mode_login', false)
    //       this.$router.replace({
    //         name: 'BrandHome',
    //         params: {
    //           brand_id: this.brandId,
    //           store_id: this.storeId,
    //         },
    //       })
    //     })
    //     .finally(() => {
    //       this.$store.dispatch('sync/setLoader', false, {
    //         root: true,
    //       })
    //     })
    // },
    login() {
      if (!this.pincode) {
        return false
      }

      this.processing = true
      if (!this.online) {
        this.loginOffline()
      } else {
        this.$store
          .dispatch('auth/pinlogin', {
            pincode: this.pincode,
          })
          .then(() => {
            this.$router.replace({
              name: 'BrandHome',
              brand_id: this.$store.getters['context/brand_id'],
              store_id: this.$store.getters['context/store_id'],
            })
          })
          .catch(error => {
            if (
              (error && error.message === 'Network Error') ||
              JSON.stringify(error.message).match('Network Error')
            ) {
              this.loginOffline()
            } else {
              this.error = error.response.data.error
              this.showError = true
              this.pincode = ''
              setTimeout(() => {
                this.showError = false
                this.error = ''
                this.pincode = ''
              }, 3000)
            }
          })
          .finally(() => {
            this.processing = false
          })
      }
    },
  },

  mounted() {
    // if (this.$route.name === 'cashierLogin') {
    //   history.pushState(null, null, location.href)
    //   window.onpopstate = function() {
    //     history.go(1)
    //   }
    // }
  },

  destroyed() {
    window.removeEventListener(
      'onpopstate',
      function() {
        history.go(1)
      },
      false
    )
  },
}
</script>

<style lang="sass" scoped>
.text-danger
  padding: 2px 14px

.errortrans-enter-active
  transition: all .1s ease

.errortrans-leave-active
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0)

.errortrans-enter
  transform: translateY(2px)
  opacity: 0
.modal-body-digits
  width: 101%

.errortrans-leave-to
  transform: translateY(-2px)
  opacity: 0


.lockpad
  button
    cursor: pointer

  background: transparent

  input::placeholder
    font-size: 16px
    font-weight: normal
    font-style: normal
    font-stretch: normal
    line-height: normal
    letter-spacing: 0.7px
    color: #91949d

  .text-danger
    background: #fff
    border-radius: 0
    font-size: 18px

  .modal-header
    background: #fff
    border-radius: 0
    font-size: 20px

    &:after
      content: ''
      position: absolute
      top: -3%
      left: 45%
      width: 0
      height: 0
      border-bottom: solid 20px #fff
      border-left: solid 15px transparent
      border-right: solid 15px transparent

    > input
      opacity: 0.85
      border-radius: 4px
      background-color: #e7e9ea
      box-shadow: none
      padding-left: 20px
      height: 2.5em
      width: 9em
      border: medium none

    .unlock
      background: rgba(98, 187, 49, 0.85)
      height: 2.5em
      border: medium none
      width: 5em
      border-radius: 4px
      color: #fff

      &:hover
        background: rgba(98, 187, 49, 0.6)
        text-decoration: none



  .modal-body-digits
    overflow: hidden
    background: rgba(25, 25, 25, 0.85)

    .dig.number-dig.blank
      height: 57px

    .dig.number-dig
      &:hover
        background: rgba(98, 187, 49, 0.85)

      &:last-child
        &:hover
          background: rgba(25, 25, 25, 0.85)
      &:nth-child(10)
        &:hover
          background: rgba(25, 25, 25, 0.85)

    > div
      width: 3em
      float: left
      padding: 10px 10px
      text-align: center
      border-right: solid 1px #2c2c2c
      text-align: center
      border-bottom: solid 1px #2c2c2c
      color: #fff
      font-size: 36px
      font-weight: 300
      font-style: normal
      font-stretch: normal
      line-height: normal
      letter-spacing: 2px
      color: #ffffff
      cursor: pointer

  .modal-footer-block

    background: #fff
    text-align: center

    a
      color: #515256

    > p
      font-size: 14px
      font-weight: 600
      font-style: normal
      font-stretch: normal
      color: #515256
      line-height: normal
      letter-spacing: 0.6px
      margin-bottom: 0

      a
        display: block
        padding: 18px 0
</style>
