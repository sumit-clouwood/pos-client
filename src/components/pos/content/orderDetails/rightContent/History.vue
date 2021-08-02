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

        <tbody v-if="orderDetails">
          <tr
            v-for="(history, index) in orderDetails.order_history"
            :key="index"
          >
            <td
              class="created_at color-tables-background field-type-cr_at field-created_at"
            >
              <span class="color-text">
                {{ convertDatetime(history.created_at, timezoneString) }}
              </span>
            </td>
            <td
              class="color-tables-background ield-type-collection_select field-user"
            >
              <span class="color-text">{{ getUserName(history.user) }}</span>
            </td>
            <td class="color-tables-background field-type-select field-name">
              <span class="color-text">{{ CONST[history.name] }}</span>
            </td>
          </tr>
          <!---->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import DateTime from '@/mixins/DateTime'
import LookupData from '@/plugins/helpers/LookupData'

export default {
  name: 'History',
  mixins: [DateTime],
  props: {
    orderDetails: {},
    userDetails: {},
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['timezoneString']),
  },
  methods: {
    getUserName(userId) {
      return LookupData.check({
        collection: this.userDetails.users._id,
        matchWith: userId,
        selection: 'name',
      })
    },
  },
}
</script>

<style lang="sass">
#nav-profile
  max-height: 500px;
  overflow: scroll;
.created_at
  span
    display: block
    width: 140px
</style>
