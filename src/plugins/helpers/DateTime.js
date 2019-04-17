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
      '00',
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

    this.hours = this.Num[this.date.getHours() - 1]
    this.mins = this.Num[this.date.getMinutes() - 1]
    this.sec = this.Num[this.date.getSeconds() - 1]
    this.year = this.date.getFullYear()
    this.day = this.Num[this.date.getDate() - 1]
    this.month = this.Num[this.date.getMonth()]

    this.monthName = this.months[this.date.getMonth()]
    this.monthNameFull = this.monthsFull[this.date.getMonth()]

    this.weekday = this.weekDays[this.date.getDay()]
    this.weekdayFull = this.weekDaysFull[this.date.getDay()]
  }

  getTime() {
    return this.hours + ':' + this.mins + ':' + this.sec
  }
  getDate() {
    return this.year + '-' + this.month + '-' + this.day
  }
}
