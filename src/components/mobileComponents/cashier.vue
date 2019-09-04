<template>
  <div class="cashier" v-if="openUserHendler && false">
    <div class="user-list">
      <div class="title">Please Select User</div>
      <div class="list">
        <user
          v-for="(user, key) in testUsers"
          :key="key"
          :param="user"
          @click.native="openUser(user)"
        />
      </div>
    </div>

    <div
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

    <div :class="['user-calc', { active: userCalcHendler }]">
      <div class="user-calc-header">
        <user :param="user" />
      </div>
      <div class="user-calc-body">
        <div class="user-calc-body-input">
          <input type="number" v-model="userPin" placeholder="1234" />
          <div class="user-calc-body-input-btn" @click="userLoginHendlerChange">
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
        <div class="pin-footer">
          <div class="pin-footer-btn" @click="openUser">
            Clock In&nbsp;/&nbsp;
          </div>
          <div class="pin-footer-btn" @click="openUser">Clock Out</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dateTime from './mobileElements/dateTime.vue'
import user from './mobileElements/user'

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
    ...mapGetters([
      'testUsers',
      'openUserHendler',
      'userCalcHendler',
      'userLoginHendler',
    ]),
  },
  components: {
    dateTime,
    user,
  },
  methods: {
    openUser(user) {
      this.user = user
      this.$store.dispatch('userCalcHendlerChange')
      this.userPin = []
      this.userKey = user.key
    },
    inputPin(e) {
      if (this.userPin.length < 4) {
        this.userPin = this.userPin + e
      }
    },
    inputDel() {
      this.userPin = this.userPin.substring(0, this.userPin.length - 1)
    },
    userLoginHendlerChange() {
      if (this.userPin == this.userKey) {
        this.$store.dispatch('userLoginHendlerChange')
      }
    },
    openUserHendlerChange() {
      this.$store.dispatch('openUserHendlerChange')
      this.$store.dispatch('userLoginHendlerChange')
    },
  },
}
</script>

<style lang="scss">
@import '../../assets/scss/variables.scss';
@import '../../assets/scss/mixins.scss';

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
  display: none;

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
    background-image: url('../../assets/images/bg.jpg');
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

    .cashier-list-body {
      /*margin-top: auto;*/
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
    background-image: url('../../assets/images/bg.jpg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 1;

    .title {
      margin-bottom: 50px;
      font-size: 20px;
    }

    .list {
      display: grid;
      grid-gap: 20px;
      overflow: auto;
      font-size: 20px;

      &::-webkit-scrollbar {
        display: none;
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
    background-image: url('../../assets/images/bg.jpg');
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

    .user {
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
          background-color: #b0b2bb;
          border-radius: 3px;
          padding: 0 20px;
          font-size: 16px;
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
