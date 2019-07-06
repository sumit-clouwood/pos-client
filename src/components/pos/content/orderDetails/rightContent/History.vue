<template>
  <div
    aria-labelledby="nav-profile-tab"
    class="tab-pane fade color-dashboard-background"
    id="nav-profile"
    role="tabpanel"
  >
    <div class="table-responsive">
      <table class="table table-hover ">
        <thead>
          <tr>
            <th class="color-secondary field-type-cr_at field-created_at">
              <span title="">{{ _t('Created At') }}</span>
            </th>
            <th class="color-secondary field-type-collection_select field-user">
              <span class="" title="">{{ _t('By Whom') }}</span>
            </th>
            <th class="color-secondary field-type-select field-name">
              <span class="" title="">{{ _t('Type') }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="orderDetails">
            <td
              class="color-tables-background field-type-cr_at field-created_at"
            >
              <span class="color-text">
                {{ orderDetails.created_at.date }}</span
              >
            </td>
            <td
              class="color-tables-background ield-type-collection_select field-user"
            >
              <span class="color-text">Seeding</span>
            </td>
            <td class="color-tables-background field-type-select field-name">
              <span class="color-text"
                >Created as {{ orderDetails.order_mode }} Order</span
              >
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
