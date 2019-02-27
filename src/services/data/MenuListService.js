import DataService from '@/services/DataService';

export default {
  fetchAll(staffId) {
    return DataService.get(`/api/auth/get/Menu/List/?staff_id=${staffId}`);
  }
};
