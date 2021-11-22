import moment from 'moment-timezone'
export default class {
  constructor(date) {
    this.date = date ? date : new Date()

    this.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    this.weekDaysFull = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    this.months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

    this.Num = [
      '00',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31',
      '32',
      '33',
      '34',
      '35',
      '36',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
      '43',
      '44',
      '45',
      '46',
      '47',
      '48',
      '49',
      '50',
      '51',
      '52',
      '53',
      '54',
      '55',
      '56',
      '57',
      '58',
      '59',
    ]

    this.monthsFull = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
  }

  parseTime() {
    this.hours = this.Num[this.date.getHours()]
    this.mins = this.Num[this.date.getMinutes()]
    this.sec = this.Num[this.date.getSeconds()]
    this.year = this.date.getFullYear()
    this.day = this.Num[this.date.getDate()]
    this.month = this.Num[this.date.getMonth()]

    this.monthName = this.months[this.date.getMonth()]
    this.monthNameFull = this.monthsFull[this.date.getMonth()]

    this.weekday = this.weekDays[this.date.getDay()]
    this.weekdayFull = this.weekDaysFull[this.date.getDay()]
  }

  getTime() {
    this.parseTime()
    return this.hours + ':' + this.mins + ':' + this.sec
  }

  getDate() {
    this.parseTime()
    return this.year + '-' + this.Num[parseInt(this.month) + 1] + '-' + this.day
  }

  dateToday() {
    this.parseTime()
    //Tuesday, 13 Oct 2017
    return (
      this.weekdayFull +
      ', ' +
      this.date.getDate() +
      ' ' +
      this.monthName +
      ' ' +
      this.year
    )
  }
  convert_datetime_to_local_moment(datetime, current_locale) {
    moment.locale(current_locale)
    var value = parseInt(datetime.$date.$numberLong)
    var result = ''
    if (value) {
      if (!moment.utc(value).isValid()) return ''
      // var fmt_in = moment(value)._f
      result = moment.utc(value).local()
    }
    return result
  }
  convertTime24to12(time) {
    // Check correct time format and split into components
    let fixTime = 0
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]
    if (time.length > 1) {
      // If time format correct
      time = time.slice(1) // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM' // Set AM/PM
      fixTime = time[0] % 12 || 12 // Adjust hours
      time[0] = parseInt(fixTime) < 9 ? '0' + fixTime : fixTime // Adjust hours
      // eslint-disable-next-line no-console
      // console.log(fixTime, time[0], time[5])
    }
    return time.join('') // return adjusted time or original string
  }

  convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ')

    let [hours, minutes] = time.split(':')

    if (hours === '12') hours = '00'

    if (modifier === 'PM') hours = parseInt(hours, 10) + 12

    return `${hours}:${minutes}`
  }
}
