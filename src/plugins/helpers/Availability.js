/* eslint-disable no-console */
import moment from 'moment-timezone'

export default {
  available(item, timezone) {
    console.log(item)

    const msNow = moment()
      .utc()
      .valueOf()

    console.log('now time utc', new Date(msNow).toString())

    //we are getting store time, convert it to utc according to store timezone
    const itemStartDateTime = moment
      .tz(item.from_date + ' ' + item.from, 'YYYY-MM-DD HH:mm', timezone)
      .utc()
      .valueOf()

    console.log(
      'store start datetime in utc ',
      new Date(itemStartDateTime).toString()
    )

    let itemEndtDateTime = moment
      .tz(item.until_date + ' ' + item.until, 'YYYY-MM-DD HH:mm', timezone)
      .utc()
      .valueOf()

    console.log(
      'store end datetime in utc ',
      new Date(itemEndtDateTime).toString()
    )

    if (item.until === '00:00') {
      //that means next date
      itemEndtDateTime = moment
        .tz(item.until_date + ' ' + item.until, 'YYYY-MM-DD HH:mm', timezone)
        .add(1, 'days')
        .utc()
        .valueOf()
    }

    console.log(
      'store end datetime after adjust in utc ',
      new Date(itemEndtDateTime).toString()
    )

    if (msNow < itemStartDateTime || msNow > itemEndtDateTime) {
      return false
    }

    const itemStartTime = moment
      .tz(
        moment()
          .tz(timezone)
          .format('YYYY-MM-DD') +
          ' ' +
          item.from,
        'HH:mm',
        timezone
      )
      .utc()
      .valueOf()

    let itemEndTime = moment
      .tz(
        moment()
          .tz(timezone)
          .format('YYYY-MM-DD') +
          ' ' +
          item.until,
        'HH:mm',
        timezone
      )
      .utc()
      .valueOf()

    if (item.until === '00:00') {
      itemEndTime = moment
        .tz(
          moment()
            .tz(timezone)
            .format('YYYY-MM-DD') +
            ' ' +
            item.until,
          'HH:mm',
          timezone
        )
        .add(1, 'days')
        .utc()
        .valueOf()
    }

    console.log('item start time utc', new Date(itemStartTime).toString())
    console.log('item end time utc', new Date(itemEndTime).toString())

    if (item.from === '00:00' && item.until === '00:00') {
      console.log('24 hours open discount')
    } else if (msNow < itemStartTime || msNow > itemEndTime) {
      return false
    }

    let dayToday = moment()
      .utc()
      .tz(timezone)
      .day()

    console.log('day today:', dayToday)

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
}
