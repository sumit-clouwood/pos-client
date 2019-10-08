import moment from 'moment-timezone'

export default {
  available(item) {
    const msNow = moment()
      .utc()
      .valueOf()
    const itemStartDateTime = moment(item.from_date + ' ' + item.from).valueOf()
    const itemEndtDateTime = moment(
      item.until_date + ' ' + item.until
    ).valueOf()

    if (msNow < itemStartDateTime || msNow > itemEndtDateTime) {
      return false
    }

    let dayToday = moment()
      .utc()
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
}
