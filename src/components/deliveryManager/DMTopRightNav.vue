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
  /* grid-row-gap: 1rem; */
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
/*.pageHeader {
  padding: 0.625rem 1.25rem 0.9375rem 2.1875rem;
  -webkit-box-shadow: 0 0px 3px var(--color-shadow-alpha_string), 0 0px 10px var(--color-shadow-alpha_string), 0 0px 20px var(--color-shadow-alpha_string);
  box-shadow: 0 0px 3px var(--color-shadow-alpha_string), 0 0px 10px var(--color-shadow-alpha_string), 0 0px 20px var(--color-shadow-alpha_string);
  z-index: 2;
  overflow: hidden;
  background-color: var(--color-background-table-rgb_string);
}
.pageHeader .page-header-container {
  display: grid;
  grid-template-columns: 1fr auto;
}
.pageHeader .title-time-container {
  display: grid;
  grid-template-columns: 1fr auto;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.page-header {
  overflow: hidden;
}
.page-header .header-overflow {
  overflow: hidden;
}
.page-header .page-title {
  margin-right: 1.25rem;
  text-overflow: ellipsis;
  overflow: hidden;
}

.pageHeader .page-title {
  font-size: 1.625rem;
  !* margin-bottom: 0.2rem; *!
}

body.body-ltr .pageHeader .title-time-container .current-time {
  margin-right: 3.75rem;
}
.pageHeader .title-time-container .current-time {
  font-size: 1.2rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 0.25rem;
}

.pageHeader .title-time-container .current-time .time {
  width: 6rem;
  font-weight: bold;
  white-space: pre;
}
.pageHeader .buttons-block {
  grid-column-start: 3;
  !* grid-row-start: 1; *!
  !* grid-row-end: 3; *!
  white-space: nowrap;
  display: grid;
  grid-template-columns: auto auto;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.breadcrumbs {
  list-style: none;
  padding-left: 0px;
  margin: 0;
  white-space: nowrap;
  overflow-x: hidden;
  font-size: 0.8rem;
  letter-spacing: 0.18rem;
  font-weight: 700;
  margin-left: 0.1rem;
  grid-column-start: 1;
  grid-column-end: 4;
  margin-top: 0.3125rem;
}
.breadcrumbs li {
  display: inline-block;
  white-space: nowrap;
}
@media only screen and (min-width: 1264px){
  .breadcrumbs li .breadcrumb-wrapper {
    max-width: 18.75rem;
  }}
.breadcrumbs li .breadcrumb-wrapper {
  display: inline-block;
  max-width: 12.5rem;
  overflow-x: hidden;
  word-break: break-word;
  text-overflow: ellipsis;
}

.breadcrumbs li .breadcrumbs_separator {
  margin-right: 5px;
}

.breadcrumbs li .breadcrumbs_separator {
  display: inline-block;
  vertical-align: top;
  margin-left: 5px;
}*/
</style>
