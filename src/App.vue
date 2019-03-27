<!-- 
The App.vue file is the root component that all other components are nested within.
-->

<template>
  <div id="app">
    <!--<div id="nav">-->
    <!--<router-link to="/">Home</router-link> |-->
    <!--<router-link to="/about">About</router-link>-->
    <!--</div>-->
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
<style lang="sass">
.error
  color: #ff0000;
  padding: 10px 5px 10px 5px;


.success
  color: #00ff00;
  padding: 10px 5px 10px 5px;
</style>

<script>
/* eslint-disable no-console */
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  console.log('All things available')
  window.addEventListener('load', () => {
    console.log('window loaded with navigator')
    navigator.serviceWorker.ready
      .then(registration => {
        console.log('Service Worker Ready IN MAIN Component')
        Notification.requestPermission()
        return registration.sync.register('postOfflineOrders')
      })
      .then(function() {
        console.log('sync event postOfflineOrders registered')
      })
      .catch(function() {
        // system was unable to register for a sync,
        // this could be an OS-level restriction
        console.log('sync registration failed')
      })
  })
}
</script>
