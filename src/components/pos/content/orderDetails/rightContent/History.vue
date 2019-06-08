<template>
  <div
    aria-labelledby="nav-profile-tab"
    class="tab-pane fade"
    id="nav-profile"
    role="tabpanel"
  >
    <div class="table-responsive">
      <table class="table table-hover ">
        <thead>
          <tr>
            <th class="field-type-cr_at field-created_at">
              <span title="">{{ _t('Created At') }}</span>
            </th>
            <th class="field-type-collection_select field-user">
              <span class="" title="">{{ _t('By Whom') }}</span>
            </th>
            <th class="field-type-select field-name">
              <span class="" title="">{{ _t('Type') }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="orderDetails">
            <td class="field-type-cr_at field-created_at">
              <span> {{ orderDetails.created_at.date }}</span>
            </td>
            <td class="field-type-collection_select field-user">
              <span>Seeding</span>
            </td>
            <td class="field-type-select field-name">
              <span>Created as {{ orderDetails.order_mode }} Order</span>
            </td>
          </tr>
          <!---->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'History',
  props: {
    orderDetails: {},
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>

<style scoped></style>
