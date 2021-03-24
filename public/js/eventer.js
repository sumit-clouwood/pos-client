window.Eventer = {
  on: function(type, method, context, scope) {
    var listeners, handlers
    if (!(listeners = this.listeners)) {
      listeners = this.listeners = {}
    }
    if (!(handlers = listeners[type])) {
      handlers = listeners[type] = []
    }
    scope = scope ? scope : window
    handlers.push({
      method: method,
      scope: scope,
      context: context ? context : scope,
    })
  },
  emit: function(type, data, context) {
    var listeners, handlers, i, n, handler
    if (!(listeners = this.listeners)) {
      return
    }
    if (!(handlers = listeners[type])) {
      return
    }
    for (i = 0, n = handlers.length; i < n; i++) {
      handler = handlers[i]
      if (typeof context !== 'undefined' && context !== handler.context)
        continue
      if (
        handler.method.call(
          handler.scope,
          data,
          type,
          handler.context,
          this
        ) === false
      ) {
        return false
      }
    }
    return true
  },
}
