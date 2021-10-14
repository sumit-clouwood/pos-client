/* eslint-disable no-console */
export default {
  netstatus: true,
  status(cb) {
    const img = new Image()
    //heartbeat
    setInterval(() => {
      img.src = process.env.BASE_URL + 'img/network.png' + '?' + Math.random()
      img.onload = event => {
        //console.log('onload hearbeat status', this.netstatus, true)
        //if (!this.netstatus)
        {
          this.netstatus = true
          cb(true, 'on', event)
        }
      }
      img.onerror = event => {
        console.log('on error hearbeat status', this.netstatus, false)
        if (this.netstatus) {
          this.netstatus = false
          cb(false, 'off', event)
        }
      }
    }, 1000 * 1)

    window.addEventListener(
      'load',
      event => {
        if (navigator.onLine) {
          cb(true, 'on', event)
        } else {
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
