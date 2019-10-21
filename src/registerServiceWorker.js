/* eslint-disable no-console */
import { register } from 'register-service-worker'
import store from './store'
// eslint-disable-next-line no-unused-vars
const notifyUserAboutUpdate = worker => {
  store.commit('sync/setAppUpdateNotification', true)
}

if (process.env.NODE_ENV === 'production') {
  console.log(`${process.env.BASE_URL}service-worker.js`)
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('Update found, New content is downloading.')
    },
    updated(registration) {
      console.log('New content is available; please refresh.')
      notifyUserAboutUpdate(registration.waiting)
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.'
      )
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
