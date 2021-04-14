import moment from 'moment-timezone'

export default {
  available(item, timezone) {
    const msNow = moment()
      .utc()
      .valueOf()

    //we are getting store time, convert it to utc according to store timezone
    const itemStartDateTime = moment
      .tz(item.from_date + ' ' + item.from, 'YYYY-MM-DD HH:mm', timezone)
      .utc()
      .valueOf()

    let itemEndtDateTime = moment
      .tz(item.until_date + ' ' + item.until, 'YYYY-MM-DD HH:mm', timezone)
      .utc()
      .valueOf()

    if (item.until === '00:00') {
      //that means next date
      itemEndtDateTime = moment
        .tz(item.until_date + ' ' + item.until, 'YYYY-MM-DD HH:mm', timezone)
        .add(1, 'days')
        .utc()
        .valueOf()
    }

    if (msNow < itemStartDateTime || msNow > itemEndtDateTime) {
      return false
    }

    const todayStoreDate = moment()
      .tz(timezone)
      .format('YYYY-MM-DD')

    const itemStartTime = moment
      .tz(todayStoreDate + ' ' + item.from, 'YYYY-MM-DD HH:mm', timezone)
      .utc()
      .valueOf()

    const itemStartHour = parseInt(item.from.split(':')[0])
    const itemStartMin = parseInt(item.from.split(':')[1])
    const itemEndHour = parseInt(item.until.split(':')[0])
    const itemEndMin = parseInt(item.until.split(':')[1])

    let incrementDay = 0
    if (itemStartHour == itemEndHour) {
      //check minutes, time may be like 00:35 => 00:10
      if (itemStartMin > itemEndMin) {
        incrementDay = 1
      }
    } else if (itemStartHour > itemEndHour) {
      //time may be 09:00 => 01:34
      incrementDay = 1
    }

    let itemEndTime = moment
      .tz(todayStoreDate + ' ' + item.until, 'YYYY-MM-DD HH:mm', timezone)
      .add(incrementDay, 'days')
      .utc()
      .valueOf()

    if (item.until === '00:00') {
      itemEndTime = moment
        .tz(todayStoreDate + ' ' + item.until, 'YYYY-MM-DD HH:mm', timezone)
        .add(1, 'days')
        .utc()
        .valueOf()
    }

    if (item.from === '00:00' && item.until === '00:00') {
      //console.log('24 hours open discount')
    } else if (msNow < itemStartTime || msNow > itemEndTime) {
      return false
    }

    let dayToday = moment()
      .utc()
      .tz(timezone)
      .day()

    dayToday -= 1
    if (dayToday < 0) {
      dayToday = 6
    }

    /*
    mon tue wed thu fri sat sun
    0   1   2   3   4   5   6
    
    sun mon tue we thu fri sat
    0    1   2  3   4   5   6
    -1   0   1  2   3   4   5 
    6
    */

    return item.available_days.includes(dayToday)
  },
  getUTCCurrentTime() {
    let d = new Date()
    let h = d.getUTCHours()
    let m = d.getUTCMinutes()
    let s = d.getUTCSeconds()
    return h + ':' + m + ':' + s
  },
  timeConvert(time, separator = ':') {
    if (time) {
      let timeSplit = time.split(separator)
      return parseInt(timeSplit[0]) * 60 + parseInt(timeSplit[1])
    }
  },
}
