<template>
  <div class="cashier" v-if="openUserHendler">
    <div
      class="user-list"
      :style="{
        'background-image': 'url(' + bg + ')',
      }"
    >
      <div class="headwrap">
        <div class="head">
          <div class="search">
            <span class="fa fa-search"></span>
            <input type="text" v-model="searchKeyword" />
          </div>
        </div>
      </div>
      <div class="list" v-if="cashiers.length">
        <user
          class="user"
          v-for="(user, key) in cashiers"
          :key="key"
          :param="user"
          @click.native="openUser(user)"
        />
      </div>
      <div v-else class="no-user">
        <div>No cashier found in store.</div>
        <router-link :to="store"> Back </router-link>
      </div>
    </div>

    <div
      :style="{ 'background-image': 'url(' + bg + ')' }"
      :class="['user-login', { active: userLoginHendler }]"
      @click="openUserHendlerChange"
    >
      <div class="cashier-list-header">
        <user :param="user" />
      </div>
      <div class="cashier-list-body"></div>
      <div class="cashier-list-footer">
        <date-time @click.native="userLoginHendlerChange" />
      </div>
    </div>

    <div
      :class="['user-calc', { active: userCalcHendler }]"
      :style="{
        'background-image': 'url(' + bg + ')',
      }"
    >
      <div class="user-calc-header">
        <user :param="user" />
      </div>
      <div class="user-calc-body">
        <div class="user-calc-body-input">
          <input
            type="number"
            v-model="userPin"
            placeholder="1234"
            :maxlength="pincodeLength"
          />
          <div
            class="user-calc-body-input-btn"
            :class="{ active: userPin.length > 3 }"
            @click="userLoginHendlerChange"
          >
            UnLock
          </div>
        </div>
        <div class="pin-input">
          <div class="pin-input-item" @click="inputPin(1)">1</div>
          <div class="pin-input-item" @click="inputPin(2)">2</div>
          <div class="pin-input-item" @click="inputPin(3)">3</div>
          <div class="pin-input-item" @click="inputPin(4)">4</div>
          <div class="pin-input-item" @click="inputPin(5)">5</div>
          <div class="pin-input-item" @click="inputPin(6)">6</div>
          <div class="pin-input-item" @click="inputPin(7)">7</div>
          <div class="pin-input-item" @click="inputPin(8)">8</div>
          <div class="pin-input-item" @click="inputPin(9)">9</div>
          <div class="pin-input-item" @click="inputPin('')"></div>
          <div class="pin-input-item" @click="inputPin(0)">0</div>
          <div class="pin-input-item" @click="inputDel">
            <i class="fa fa-angle-left" aria-hidden="true"></i>
          </div>
        </div>
        <transition name="errortrans">
          <div class="error text-danger" v-show="showError">
            {{ error }}
          </div>
        </transition>
        <div class="progress-container" v-show="processing">
          <Progress />
        </div>
        <div class="pin-footer">
          <div class="pin-footer-btn">
            <router-link :to="store">Clock In</router-link>&nbsp;/&nbsp;
          </div>
          <div class="pin-footer-btn">
            <router-link :to="store">Clock Out</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dateTime from './mobileElements/dateTime.vue'
import user from './mobileElements/user'
import Progress from '@/components/util/Progress'

export default {
  name: 'cashierList',
  data() {
    return {
      user: '',
      userPin: '',
      userKey: null,
      error: false,
      showError: false,
      pincodeLength: 4,
      processing: false,
    }
  },
  computed: {
    bg() {
      return this.$store.getters['location/bgImage'] || 'img/bg.jpg'
    },
    searchKeyword: {
      get() {
        return this.$store.state.auth.searchKeyword
      },
      set(value) {
        this.$store.commit('auth/setSearchKeyword', value)
      },
    },
    ...mapGetters('context', ['store']),
    ...mapGetters('auth', ['cashiers']),
    ...mapGetters(['openUserHendler', 'userCalcHendler', 'userLoginHendler']),
  },
  components: {
    dateTime,
    user,
    Progress,
  },
  mounted() {
    this.$store.dispatch('userCalcHendlerChange', false)
  },
  methods: {
    openUser(user) {
      this.user = user
      this.$store.dispatch('userCalcHendlerChange')
      this.userPin = ''
      this.userKey = user.email
    },
    inputPin(e) {
      if (this.userPin.length < this.pincodeLength) {
        this.userPin = this.userPin + e
      }
    },
    inputDel() {
      this.userPin = this.userPin.substring(0, this.userPin.length - 1)
    },
    login() {
      if (!this.userPin) {
        return false
      }
      this.processing = true
      this.$store
        .dispatch('auth/pinlogin', { email: this.userKey, pin: this.userPin })
        .then(() => {
          this.$store.dispatch('userCalcHendlerChange', false)
          this.$router.replace({ name: 'HomeDefault' })
        })
        .catch(error => {
          this.error = error
          this.showError = true
          this.userPin = ''
          setTimeout(() => {
            this.showError = false
          }, 3000)
        })
        .finally(() => {
          this.processing = false
        })
    },

    userLoginHendlerChange() {
      // if (this.userPin == this.userKey) {
      //   this.$store.dispatch('userLoginHendlerChange')
      // }
      this.login()
    },
    openUserHendlerChange() {
      this.$store.dispatch('openUserHendlerChange')
      this.$store.dispatch('userLoginHendlerChange')
    },
  },
}
</script>
<style lang="sass" scoped>
.error
  background: #fff
  border-bottom: 1px solid #ccc
  text-align: center

.errortrans-enter-active
  transition: all .1s ease

.errortrans-leave-active
  transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0)

.errortrans-enter
  transform: translateY(2px)
  opacity: 0

.errortrans-leave-to
  transform: translateY(2px)
  opacity: 0
</style>
<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
::-webkit-scrollbar {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.no-user {
  text-align: center;
  padding-top: 30px;
}
.headwrap {
  width: 100%;
  .head {
    width: 70%;
    margin: 0 auto;
    margin: 0 auto;

    .search {
      height: 40px;
      line-height: 40px;
      width: 100%;
      position: relative;
      color: #757575;
      display: inline-block;

      input {
        color: #757575;
        width: 100%;
        height: 40px;
        background: #fcfcfc;
        border: 1px solid #aaa;
        border-radius: 5px;
        box-shadow: 0 0 3px #ccc, 0 10px 15px #ebebeb inset;
        padding-right: 30px;
        padding-left: 10px;
        box-sizing: border-box;

        &:focus {
          outline: none;
        }
      }
      .fa-search {
        position: absolute;
        top: 10px;
        right: 10px;

        &:before {
          font-size: 20px;
        }
      }
    }
  }
}
.cashier {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  background-color: #fff;
  color: #fff;
  z-index: 1060;
  font-size: 20px;

  .user-login {
    display: grid;
    flex-direction: column;
    grid-template-rows: max-content 1fr max-content;
    position: absolute;
    top: 0;
    right: -100vw;
    bottom: 0;
    width: 100vw;
    height: 100%;

    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 3;
    transition: 0.5s ease-out;

    &.active {
      right: 0;
    }

    .cashier-list-header {
      padding: 20px;
      display: grid;
      justify-content: left;

      .user-block {
        display: inline-grid;
        grid-template-columns: 1fr max-content;
        grid-column-gap: 20px;
        margin-left: auto;

        .title {
          display: grid;
          align-items: end;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .subtitle {
          strong {
            letter-spacing: 1px;
          }
        }

        .image {
          width: 55px;
          height: 55px;
          grid-column-start: 2;
          grid-column-end: 3;
          grid-row-start: 1;
          grid-row-end: 3;
          border: 2px solid #fff;
          border-radius: 50%;
        }
      }
    }

    .cashier-list-footer {
      padding: 20px;
      /*margin-top: auto;*/

      .date-time {
        a {
          color: #fff;
          font-weight: 400;
          display: grid;

          .time {
            font-size: 50px;
            line-height: 50px;
            text-align: right;
            margin-right: 0;
          }

          .date {
            font-size: 14px;
            text-align: right;
          }
        }
      }
    }
  }

  .user-list {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    right: -100vw;
    right: 0;
    bottom: 0;
    width: 100vw;
    padding: 70px 20px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 1;

    .title {
      margin-bottom: 50px;
      font-size: 20px;
    }

    .list {
      display: flex;
      font-size: 20px;
      flex-wrap: wrap;
      overflow: auto;

      .user {
        padding: 20px;
        width: 320px;
      }
    }
  }

  .user-calc {
    position: absolute;
    top: 0;
    right: -100vw;
    bottom: 0;
    width: 100vw;
    padding: 20px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 2;
    transition: 0.5s ease-out;
    display: grid;
    align-content: end;
    grid-template-rows: max-content max-content;
    flex-direction: column;
    align-items: stretch;

    &.active {
      right: 0;
    }

    .closeCalc {
      position: absolute;
      top: 30px;
      right: 35px;
      color: #fff;
    }

    .user-calc-body {
      .user-calc-body-input {
        margin-top: auto;
        width: 100%;
        margin-top: 20px;
        border: none;
        display: grid;
        grid-template-columns: 1fr max-content;
        grid-gap: 10px;
        align-items: center;
        background-color: #fff;
        padding: 10px;

        input {
          height: 45px;
          background-color: #ebeced;
          border: none;
          border-radius: 3px;
          width: 100%;
          letter-spacing: 10px;
          padding: 0 20px;
          outline: none;
        }

        .user-calc-body-input-btn {
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 3px;
          padding: 0 20px;
          font-size: 16px;
          background-color: #b0b2bb;

          &.active {
            cursor: pointer;
            background: rgba(98, 187, 49, 0.85);
            &:hover {
              background: rgba(98, 187, 49, 0.6);
              text-decoration: none;
            }
          }
        }
      }

      .pin-input {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        border-left: 1px solid rgba(255, 255, 255, 0.3);
        border-top: 1px solid rgba(255, 255, 255, 0.3);

        .pin-input-item {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60px;
          border-right: 1px solid rgba(255, 255, 255, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          background-color: rgba(0, 0, 0, 0.7);
          font-size: 36px;
        }
      }

      .pin-footer {
        display: grid;
        grid-template-columns: max-content max-content;
        justify-content: center;
        background-color: #fff;
        padding: 10px;
        color: #333;

        .pin-footer-btn {
          display: flex;
          align-items: center;
          font-size: 14px;
        }
      }
    }
  }
}

@include responsive(mobile) {
  .cashier {
    display: block;
  }
}
</style>
