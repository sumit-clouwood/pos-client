<template>
  <div class="content-wrapper">
    <div class="admin-login-wrapper">
      <div class="login-wrapper">
        <ul class="ullist-admin">
          <li data-placement="above">
            <img
              class="transform-img"
              src="@/assets/images/broccoli-profile.jpg"
              alt="admin"
            /><span>Aisyah Zidni</span>
          </li>
          <li data-placement="above">
            <img
              class="transform-img"
              src="@/assets/images/broccoli-profile.jpg"
              alt="admin"
            /><span>Nirmala Azalea</span>
          </li>
          <li data-placement="above">
            <img
              class="transform-img"
              src="@/assets/images/broccoli-profile.jpg"
              alt="admin"
            /><span>Bena Kane</span>
          </li>
          <li data-placement="above">
            <img
              class="transform-img"
              src="@/assets/images/broccoli-profile.jpg"
              alt="admin"
            /><span>Firmino Kudo</span>
          </li>
          <li data-placement="above">
            <img
              class="transform-img"
              src="@/assets/images/broccoli-profile.jpg"
              alt="admin"
            /><span>Beby Jovanca</span>
          </li>
        </ul>
        <div id="popover_content_wrapper">
          <!-- Modal content-->
          <div class="modal-content">
            <div class="modal-header">
              <input
                type="text"
                placeholder="Enter PIN"
                name="PIN"
                id="input-value"
              /><a href="/cashier-login/absent-login.html" class="unlock"
                >Unlock</a
              >
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex'
//import dateTime from '@/components/mobileComponents/mobileElements/dateTime.vue'
//import user from './User'

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
    //dateTime,
    ///user,
  },
  methods: {},
  mounted() {
    $('.number-dig').click(function() {
      var value = $('#input-value').val()
      var valThis = $(this).text()
      var res = value.concat(valThis)
      $('#input-value').val(res)
    })
    $('#backspace').click(function() {
      var value = $('#input-value').val()
      $('#input-value').val('' + value.substr(0, value.length - 1) + '')
    })

    $('.ullist-admin > li > img').click(function() {
      $(this)
        .parent('li')
        .addClass('position-set')
        .siblings('.position-set')
        .removeClass('position-set')

      $('.position-set').append($('#popover_content_wrapper'))
      $('.position-set').append($('#absent-content'))
      $('#popover_content_wrapper').addClass('animated zoomIn')
      $('#absent-content').addClass('animated zoomIn')
      $('#absent-content.effect-1').addClass('animated zoomIn')
      $('#absent-content.effect-2').addClass('animated tada')
      $('#absent-content.effect-3').addClass('animated shake')
      $('#absent-content.effect-4').addClass('animated fadeInLeft')

      $('#popover_content_wrapper').show()
      $('#absent-content').show()
    })
  },
}
</script>

<style lang="scss" scoped>
button {
  cursor: pointer;
}

.ullist-admin > li > {
  img,
  span {
    cursor: pointer;
  }
}

.modal-footer-block > p {
  cursor: pointer;
}

.admin-login-wrapper {
  overflow: hidden;
  margin: 0 auto;
  width: 100%;
  background: rgba(33, 33, 33, 0.45);
  height: 100vh;
}

.content-wrapper {
  overflow: hidden;
  height: 100vh;
  background: url(~@/assets/images/mask@2x.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  &.full-bg {
    background-size: contain !important;
    background: #000 url(~@/assets/images/mask@2xy.jpg);
    background-repeat: no-repeat;
    background-position: center center;
  }
}

input::placeholder {
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.7px;
  color: #91949d;
}

.admin-profile-details {
  text-align: right;
}

.admin-login {
  width: 1180px;
  margin: 0 auto;
  overflow: hidden;
  max-width: 100%;
  margin-top: calc(100vh - 200px);
}

.admin-profile-details > div {
  display: inline-block;
}

.login-time > {
  * {
    display: inline-block;
  }

  span {
    vertical-align: top;
    color: #fff;
    font-size: 24px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 1px;
    color: #ffffff;
  }
}

.login-details {
  padding-top: 20px;
  position: relative;
  top: 20px;
  right: -30px;
}

.login-time > h1 {
  font-size: 90px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 72px;
  letter-spacing: 3.7px;
  font-family: 'Proxima Nova';
  color: #fff;
}

.login-date-time > p {
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 1px;
  font-family: 'Proxima Nova';
  padding-top: 15px;
  color: #fff;
}

.login-details > {
  h2 {
    font-size: 24px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 1px;
    font-family: 'Proxima Nova';
    color: #fff;
  }

  p {
    font-size: 18px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 1px;
    text-align: right;
    font-family: 'Proxima Nova';
    color: #fff;
  }
}

.login-wrapper {
  width: 1180px;
  max-width: 100%;
  margin: 0 auto;
}

ul.ullist-admin > li {
  display: inline-block;
  padding: 50px 0;
}

.admin-login-wrapper ul.ullist-admin {
  padding-top: 5px;
}

ul.ullist-admin {
  margin: 0 auto;
  text-align: center;
  padding-top: 90px;

  > li > span {
    font-size: 18px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.7px;
    color: #ffffff;
    display: block;
    position: relative;
    top: -40px;
  }
}

.absent-footer > p:hover a {
  color: #fff;
}

.login-wrapper .modal-dialog {
  max-width: 365px;
}

.modal-header {
  > input {
    opacity: 0.85;
    border-radius: 4px;
    background-color: #e7e9ea;
    box-shadow: none;
    padding-left: 20px;
    height: 60px;
    width: 204px;
    border: medium none;
  }

  .unlock {
    &:hover {
      background: rgba(98, 187, 49, 0.6);
      text-decoration: none;
    }

    background: rgba(98, 187, 49, 0.85);
    height: 60px;
    border: medium none;
    width: 116px;
    border-radius: 4px;
    color: #fff;
    padding: 18px 0;
  }
}

.absent-footer > p > a {
  color: #515256;
  font-size: 14px;
  display: block;

  &:hover {
    text-decoration: none;
  }
}

div#popover_content_wrapper {
  width: 365px;
}

.modal-body-digits {
  overflow: hidden;
  background: rgba(25, 25, 25, 0.85);

  > div {
    width: 121px;
    float: left;
    padding: 15px 10px;
    text-align: center;
    border-right: solid 1px #2c2c2c;
    text-align: center;
    border-bottom: solid 1px #2c2c2c;
    color: #fff;
    font-size: 36px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 2px;
    color: #ffffff;
    cursor: pointer;
  }
}

#popover_content_wrapper {
  .modal-content {
    background: transparent;
  }

  .modal-header {
    background: #fff;
    border-radius: 0;
  }
}

.dig.number-dig.blank {
  height: 70px;
}

.modal-footer-block {
  > p {
    font-size: 14px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.6px;
    color: #515256;
    margin-bottom: 0;
    padding: 18px 0;
  }

  background: #fff;
  text-align: center;
}

div#absent-content {
  width: 351px;
  margin: 0 auto;
  background: #fff;
  text-align: center;
}

.clock-wrap {
  overflow: hidden;
  width: 308px;
  margin: 20px auto !important;
}

div#absent-content > {
  h1 {
    font-size: 18px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.7px;
    color: #3f4247;
    text-align: center;
    padding: 15px 0;
  }

  input {
    width: 308px;
    height: 50px;
    opacity: 0.85;
    border-radius: 4px;
    background-color: #e7e9ea;
    border: medium none;
    margin: 0 auto !important;
    padding-left: 15px;
  }
}

.clock-wrap > button {
  &.clock-in {
    &:hover {
      background: rgba(98, 187, 49, 0.6);
    }

    background: rgba(98, 187, 49, 0.85);
    color: #fff;
    border: medium none;
    height: 50px;
    padding: 0px 20px;
    border-radius: 4px;
    float: left;
    width: 140px;
    font-size: 14px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.6px;
    color: #ffffff;
  }

  &.clock-out {
    &:hover {
      background: rgba(217, 31, 31, 0.6);
    }

    background: rgba(217, 31, 31, 0.85);
    color: #fff;
    border: medium none;
    height: 50px;
    padding: 0px 20px;
    border-radius: 4px;
    float: right;
    width: 140px;
    font-size: 14px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.6px;
    color: #ffffff;
  }
}

.absent-footer > p {
  cursor: pointer;
  margin-bottom: 0;
  padding: 18px 0;
  border-top: solid 1px #d3d3d3;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.6px;
  color: #515256;
}

.clock-wrap {
  overflow: hidden;
  margin: 20px 0;
}

#popover_content_wrapper .modal-header:after {
  content: '';
  position: absolute;
  top: -4%;
  left: 57%;
  margin-left: -50px;
  width: 0;
  height: 0;
  border-bottom: solid 20px #fff;
  border-left: solid 15px transparent;
  border-right: solid 15px transparent;
}

div#popover_content_wrapper {
  width: 365px;
  position: absolute;
  left: -70px;
  right: 8px;
  top: 295px;
}

.ullist-admin > li.position-set {
  position: relative;
}

div#absent-content {
  &:before {
    content: '';
    position: absolute;
    top: -7.5%;
    left: 59%;
    margin-left: -50px;
    width: 0;
    height: 0;
    border-bottom: solid 20px #fff;
    border-left: solid 15px transparent;
    border-right: solid 15px transparent;
  }

  position: absolute;
  top: 300px;
  left: -50px;
}

.login-profile > img {
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.7);
  -webkit-transform: scale(0.5, 0.5);
  -moz-transform: scale(0.5, 0.5);
  -o-transform: scale(0.5, 0.5);
  -ms-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  transition: all 0.4s ease;
}

.ullist-admin > li {
  > img {
    -webkit-transform: scale(0.5, 0.5);
    -moz-transform: scale(0.5, 0.5);
    -o-transform: scale(0.5, 0.5);
    -ms-transform: scale(0.5, 0.5);
    transform: scale(0.5, 0.5);
    transition: all 0.4s ease;
    margin-bottom: 15px;
  }

  &.position-set > img {
    -webkit-transform: scale(0.7, 0.7);
    -moz-transform: scale(0.7, 0.7);
    -o-transform: scale(0.7, 0.7);
    -ms-transform: scale(0.7, 0.7);
    transform: scale(0.7, 0.7);
    transition: all 0.4s ease;
    margin-bottom: 15px;
  }

  > img:hover {
    -webkit-transform: scale(0.7, 0.7);
    -moz-transform: scale(0.7, 0.7);
    -o-transform: scale(0.7, 0.7);
    -ms-transform: scale(0.7, 0.7);
    transform: scale(0.7, 0.7);
    transition: all 0.6s ease;
    margin-bottom: 15px;
  }
}

img.transform {
  display: none;
}

.dig.number-dig:hover {
  background: rgba(98, 187, 49, 0.85);
}

.modal-body-digits > div:last-child:hover {
  background: rgba(25, 25, 25, 0.85);
}

.modal-footer-block > p:hover,
.absent-footer > p:hover {
  background: rgba(98, 187, 49, 0.85);
  color: #fff;
}

.ullist-admin > li > img {
  transition: all 1s ease-in-out;
}

img.transform {
  width: 75%;
}

ul.ullist-admin > li {
  &:nth-child(2) > img.transform {
    width: 60%;
  }

  > img {
    margin: 0 auto;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.7);
  }
}

.ullist-admin > li.position-set {
  > {
    .transform {
      display: block;
      transition: all 1s ease-in-out;
    }

    .transform-scale {
      display: none;
    }
  }

  #popover_content_wrapper {
    display: block !important;
  }
}

#popover_content_wrapper {
  display: none;
}
</style>
