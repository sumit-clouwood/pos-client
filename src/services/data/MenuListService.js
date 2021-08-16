import DataService from '@/services/DataService'

export default {
  fetchAll(staffId) {
    return DataService.get(
      `/auth/get/Menu/List/?staff_id=${staffId}`,
      null,
      false
    )
  },
}
