<template>
  <div class="lockpad">
    <div class="header">
      <input type="number" v-model="userPin" placeholder="1234" />
      <button>UnLock</button>
    </div>
    <div class="separator"></div>
    <div class="body">
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
    <div class="separator"></div>
    <div class="footer">
      <div class="btn">
        Clock In /
      </div>
      <div class="btn">Clock Out</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cashierList',
  data() {
    return {}
  },
  computed: {},
  components: {},
  methods: {},
}
</script>

<style lang="sass" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.edge
  width: 28px;
  height: 18px;
  background-color: #ffffff;

.header
  width: 351px;
  height: 85px;
  background-color: #ffffff;
  input
    width: 204px;
    height: 60px;
    opacity: 0.85;
    border-radius: 4px;
    background-color: #e7e9ea;
    font-family: ProximaNova;
    font-size: 18px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.75px;
    color: #91949d;
  button
    width: 116px;
    height: 60px;
    opacity: 0.85;
    border-radius: 4px;
    background-color: var(--grass);
    label
      width: 48px;
      height: 17px;
      font-family: ProximaNova;
      font-size: 14px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.58px;
      color: #ffffff;

.separator
  width: 351px;
  height: 3px;
  border: solid 1px #2c2c2c;

.body
  width: 351px;
  height: 369px;
  opacity: 0.85;
  background-color: #191919;
  .digit
    width: 24px;
    height: 44px;
    font-family: ProximaNova;
    font-size: 36px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 1.5px;
    color: #ffffff;

.footer
  width: 351px;
  height: 53px;
  background-color: #ffffff;
  btn
    width: 136px;
    height: 17px;
    font-family: ProximaNova;
    font-size: 14px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.57px;
    color: #515256;
</style>
