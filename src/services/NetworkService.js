/* eslint-disable no-console */
export default {
  status(cb) {
    window.addEventListener(
      'load',
      event => {
        if (navigator.onLine) {
          console.log('navigator online')
          cb(true, 'on', event)
        } else {
          console.log('navigator offline')
          cb(false, 'off', event)
        }
      },
      false
    )

    window.addEventListener(
      'online',
      event => {
        console.log("And we're back :)")
        cb(true, 'on', event)
        // Get updates from server.
      },
      false
    )

    window.addEventListener(
      'offline',
      event => {
        console.log('Connection is flaky.')
        cb(false, 'off', event)
        // Use offine mode.
      },
      false
    )
  },
}
