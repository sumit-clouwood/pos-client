import moment from 'moment-timezone'
/* global $ */
export default {
  methods: {
    humanDateTime(data) {
      setInterval(function() {
        let date =
          typeof data.order_created != 'undefined' ? data.order_created : data

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
    convertDatetime(datetime, tz, format = 'Do MMM YYYY,  hh:mm:ss A') {
      moment.locale(tz)
      var value =
        datetime != null && typeof datetime.$date != 'undefined'
          ? parseInt(datetime.$date.$numberLong)
          : datetime
      var result = ''
      if (value) {
        if (!moment.utc(value).isValid()) return ''
        var fmt_in = moment(value)._f
        result = moment
          .utc(value, fmt_in)
          .tz(tz)
          .format(format)
      }
      return result
    },
    toLocaleDateTimeString(dateTime) {
      return moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
    },
    orderTimer: function(dateTime, tz) {
      var startDateTime = new Date(dateTime) // YYYY (M-1) D H m s (start time and date from DB)
      var startStamp = startDateTime.getTime()

      var indiaTime = new Date().toLocaleString('en-US', {
        timeZone: tz,
      })
      var newDate = new Date(indiaTime)
      var newStamp = newDate.getTime()
      var diff = Math.round((newStamp - startStamp) / 1000)

      var d = Math.floor(diff / (24 * 60 * 60))
      diff = diff - d * 24 * 60 * 60
      var h = Math.floor(diff / (60 * 60))
      diff = diff - h * 60 * 60
      var m = Math.floor(diff / 60)
      diff = diff - m * 60
      var s = diff
      let timer = '00:00:00'
      if (dateTime != '') {
        if (d > 0) timer += d + ' day(s), '
        timer = h + ' hour(s), ' + m + ' minute(s), ' + s + ' second(s)'
      }
      return timer
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
    //moment returns date in arabic format if arabic local is arabic
    //but we need date in english format as we need to send it to backend
    moment.locale('en')
    return moment.utc().format('YYYY-MM-DD HH:mm:ss')
  },

  getPreviousDayUTCDate() {
    return moment
      .utc()
      .subtract(1, 'day')
      .format('YYYY-MM-DD')
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
