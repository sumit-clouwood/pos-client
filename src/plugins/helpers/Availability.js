import moment from 'moment-timezone'

export default {
  available(item) {
    const msNow = moment()
      .utc()
      .valueOf()
    const itemStartDateTime = moment(item.from_date).valueOf()
    let endDate = moment(item.until_date).valueOf()

    if (item.until === '00:00') {
      //that means next date
      endDate = moment(item.until_date)
        .add(1, 'days')
        .valueOf()
    }

    const itemEndtDateTime = moment(endDate).valueOf()

    if (msNow < itemStartDateTime || msNow > itemEndtDateTime) {
      return false
    }

    const itemStartTime = moment(item.from, 'HH:mm').valueOf()
    let itemEndTime = moment(item.until, 'HH:mm').valueOf()

    if (item.until === '00:00') {
      itemEndTime = moment(item.until, 'HH:mm')
        .add(1, 'days')
        .valueOf()
    }

    if (msNow < itemStartTime || msNow > itemEndTime) {
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
