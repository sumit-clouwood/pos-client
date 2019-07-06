import moment from 'moment-timezone'
/* global $ */
export default {
  methods: {
    humanDateTime(data) {
      setInterval(function() {
        let date = data.order_created

        let date_future = new Date(date)
        let date_now = new Date()

        let seconds = Math.floor((date_now - date_future) / 1000)
        let minutes = Math.floor(seconds / 60)
        let hours = Math.floor(minutes / 60)
        let days = Math.floor(hours / 24)

        hours = hours - days * 24
        minutes = minutes - days * 24 * 60 - hours * 60
        seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60

        /*let htmlElement = [
          {
            Days: days,
            Hours: hours,
            Minutes: minutes,
            Seconds: seconds,
          },
        ]*/
        let htmlElement =
          days +
          ' Days, ' +
          hours +
          ' Hours, ' +
          minutes +
          ' Minutes, ' +
          seconds +
          ' Seconds'
        $('p#' + data.order_no).html(htmlElement)
        $('p#od' + data.order_no).html(htmlElement)
        return htmlElement
      }, 1000)
    },
    convertDatetime(datetime, fmt_out = 'Do MMM YYYY,  hh:mm:ss A') {
      moment.locale('en-US')
      var value =
        typeof datetime != 'undefined' && typeof datetime.$date != 'undefined'
          ? parseInt(datetime.$date.$numberLong)
          : false
      var result = ''
      if (value) {
        if (!moment.utc(value).isValid()) return ''
        var fmt_in = moment(value)._f
        result = moment
          .utc(value, fmt_in)
          .local()
          .format(fmt_out)
      }
      return result
    },
  },

  getUTC() {
    let UTCDate = new Date() // local datetime
    UTCDate = new Date(
      UTCDate.getUTCFullYear(),
      UTCDate.getUTCMonth(),
      UTCDate.getUTCDate(),
      UTCDate.getUTCHours(),
      UTCDate.getUTCMinutes(),
      UTCDate.getUTCSeconds()
    )
    return UTCDate
  },

  getUTCTime(format) {
    if (format == undefined) {
      format = '24hr'
    }
    if (format == '12hr') {
      return moment.utc().format('hh:mm A')
    } else {
      return moment.utc().format('HH:mm:ss')
    }
  },

  getUTCDate() {
    return moment.utc().format('YYYY-MM-DD')
  },

  getUTCDateTime() {
    return moment.utc().format('YYYY-MM-DD HH:mm:ss')
  },

  getTimezoneTime(timezone, format) {
    let momentUTC = moment.tz(this.getUTCDateTime(), 'UTC')
    if (format == undefined) {
      format = '24hr'
    }
    if (format == '12hr') {
      return momentUTC
        .clone()
        .tz(timezone)
        .format('hh:mm A')
    } else {
      return momentUTC
        .clone()
        .tz(timezone)
        .format('HH:mm:ss')
    }
  },

  getTimezoneDate(timezone) {
    let momentUTC = moment.tz(this.getUTCDateTime(), 'UTC')
    return momentUTC
      .clone()
      .tz(timezone)
      .format('YYYY-MM-DD')
  },

  getTimezoneDateTime(timezone) {
    let momentUTC = moment.tz(this.getUTCDateTime(), 'UTC')
    return momentUTC
      .clone()
      .tz(timezone)
      .format('YYYY-MM-DD HH:mm:ss')
  },

  // eslint-disable-next-line no-unused-vars
  convertToTimezone(date, timezone) {
    /**
     *  date to UTC then to expected timezone
     *  return Date()
     */
    return date
    /*
    let dateUTC = moment(date)
      .clone()
      .tz('UTC')
    return dateUTC
      .clone()
      .tz(timezone)
      .format('YYYY-MM-DD HH:mm:ss')
      .toDate()
  },*/
  },
}
