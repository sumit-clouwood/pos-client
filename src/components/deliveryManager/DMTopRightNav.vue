<template>
  <div class="page-header">
    <div class="current-time">
      <span class="date">July 2nd 2019</span>&nbsp;&nbsp;&nbsp;
      <span class="time">11:09:08 AM</span>
    </div>
    <div class="button-block">
      <div class="change-location">
        <button class="btn btn-success">Change Brand</button>
        <button class="btn btn-success walkin-btn">Walk-in</button>
      </div>
      <div class="lang-selector">
        <div class="v-menu v-menu--inline">
          <div class="v-menu__activator">
            <button type="button" class="v-btn v-btn--icon theme--light">
              <div class="v-btn__content">
                <div class="lang-flag-container">
                  <img src="/img/icons/us.svg" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DMTopRightNav',
}
</script>

<style scoped lang="css">
.page-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
.page-header .button-block > button {
  margin-right: 10px;
}
.page-header .current-time {
  font-size: 1.2rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 0.25rem;
}
.v-menu__activator {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  cursor: pointer;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.lang-flag-container {
  display: flex;

}
.lang-flag-container > img{
  width: 25px;
}

button.v-btn.v-btn--icon.theme--light {
  padding: 8px;
  background: red;
  border: medium none;
  border-radius: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  height: 40px;
  width: 40px;
  justify-content: center;
}

.button-block {
  display: grid;
  grid-template-columns: 3fr 1fr;
}

.change-location > button {
  margin-right: 5px;
}
</style>
