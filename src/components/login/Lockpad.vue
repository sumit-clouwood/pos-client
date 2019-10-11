<template>
  <div class="modal-content lockpad">
    <div class="modal-header">
      <input
        type="text"
        placeholder="Enter PIN"
        name="PIN"
        id="input-value"
      /><a href="/cashier-login/absent-login.html" class="unlock">Unlock</a>
    </div>
    <div class="modal-body-digits">
      <div class="dig number-dig">1</div>
      <div class="dig number-dig">2</div>
      <div class="dig number-dig">3</div>
      <div class="dig number-dig">4</div>
      <div class="dig number-dig">5</div>
      <div class="dig number-dig">6</div>
      <div class="dig number-dig">7</div>
      <div class="dig number-dig">8</div>
      <div class="dig number-dig">9</div>
      <div class="dig number-dig blank"></div>
      <div class="dig number-dig">0</div>
      <div class="dig number-dig" id="backspace">
        <img src="~@/assets/images/close.png" alt="back" />
      </div>
    </div>
    <div class="modal-footer-block">
      <p>Clock In / Clock Out</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Lockpad',
  data() {
    return {}
  },
  computed: {},
  components: {},
  methods: {},
}
</script>

<style lang="sass" scoped>
.lockpad
  background: transparent

  input::placeholder
    font-size: 16px
    font-weight: normal
    font-style: normal
    font-stretch: normal
    line-height: normal
    letter-spacing: 0.7px
    color: #91949d


  .modal-header
    background: #fff
    border-radius: 0
    font-size: 20px

    &:after
      content: ''
      position: absolute
      top: -4%
      left: 57%
      margin-left: -50px
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
      height: 60px
      width: 204px
      border: medium none

    .unlock
      background: rgba(98, 187, 49, 0.85)
      height: 60px
      border: medium none
      width: 116px
      border-radius: 4px
      color: #fff
      padding: 18px 0

      &:hover
        background: rgba(98, 187, 49, 0.6)
        text-decoration: none

  .modal-body-digits
    overflow: hidden
    background: rgba(25, 25, 25, 0.85)

    .dig.number-dig.blank
      height: 70px

    .dig.number-dig
      &:hover
        background: rgba(98, 187, 49, 0.85)
      &:last-child
        &:hover
          background: rgba(25, 25, 25, 0.85)

    > div
      width: 121px
      float: left
      padding: 15px 10px
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
    > p
      font-size: 14px
      font-weight: 600
      font-style: normal
      font-stretch: normal
      line-height: normal
      letter-spacing: 0.6px
      color: #515256
      margin-bottom: 0
      padding: 18px 0
      cursor: pointer

      &:hover
        background: rgba(98, 187, 49, 0.85);
        color: #fff;
</style>
