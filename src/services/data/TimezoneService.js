import DataService from '@/services/DataService'

export default {
  getTimezoneData() {
    return DataService.get(`/model/timezones?no_limit=true`, false)
  },
}
