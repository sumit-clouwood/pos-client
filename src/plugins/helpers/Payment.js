/* eslint-disable no-console */
import Paysky from './Paysky'
export default {
  factory($store, event, data, context) {
    switch (context) {
      case 'checkout':
        switch (event) {
          case 'paysky':
            return new Paysky($store, event, data, context)
        }
        break
    }
  },
  exec($store, event, data, context) {
    const handler = this.factory($store, event, data, context)
    handler.exec()
  },
}
