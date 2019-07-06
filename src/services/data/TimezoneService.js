import DataService from '@/services/DataService'

export default {
  getTimezoneData(timezone) {
    return DataService.get(`/model/timezones/id/${timezone}/edit`, false)
  },
}
