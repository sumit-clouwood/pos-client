/* eslint-disable no-console */
import { register } from 'register-service-worker'
import store from './store'

const notifyUserAboutUpdate = worker => {
  console.log('update available')
  worker.postMessage({ action: 'skipWaiting' })

  const time = +new Date()

  // localStorage.setItem('pos_version_updated_on', time)
  // store.commit('sync/setAppUpdateNotification', true)
  // localStorage.setItem('update_available', true)
  let lastUpdatedTime = localStorage.getItem('pos_version_updated_on') || 0
  lastUpdatedTime = parseInt(lastUpdatedTime) + 1000 * 60 * 60 * 6

  console.log(
    1,
    'service worker last updated',
    lastUpdatedTime,
    time,
    lastUpdatedTime <= time
  )

  if (lastUpdatedTime <= time) {
    console.log('now time is greater ', time, lastUpdatedTime)

    localStorage.setItem('pos_version_updated_on', time)
    store.commit('sync/setAppUpdateNotification', true)
    localStorage.setItem('update_available', true)
  }
}

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      // console.log(
      //   'App is being served from cache by a service worker.\n' +
      //     'For more details, visit https://goo.gl/AFskqB'
      // )
    },
    registered() {
      //console.log('Service worker has been registered.')
    },
    cached() {
      // console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('Update found, New content is downloading.')
    },
    updated(registration) {
      console.log(
        'New content is available; please refresh., notifying user about update',
        registration
      )
      notifyUserAboutUpdate(registration.waiting)
    },
    offline() {
      // console.log(
      //   'No internet connection found. App is running in offline mode.'
      // )
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })

  // var refreshing = false
  // navigator.serviceWorker.addEventListener('controllerchange', () => {
  //   if (refreshing) {
  //     console.log('already refreshing')
  //   } else {
  //     console.log('refreshing page')
  //     window.location.reload()
  //     console.log('page reloaded')
  //     refreshing = true
  //   }
  // })
}
