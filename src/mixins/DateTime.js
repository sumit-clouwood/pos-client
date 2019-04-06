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
  },
}