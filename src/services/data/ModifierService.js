import DataService from '@/services/DataService';

export default {
  fetchAll(...[locationId, isCompress]) {
    return DataService.get(
      `/api/auth/getallmodifiers/?location_id=${locationId}&is_compress=${isCompress}`
    );
  }
};
