<template>
  <div class="manage-customer-table">
    <table class="table table-responsive">
      <tr>
        <th style="width: 190px">{{ _t("Order Number") }}</th>
        <th style="width: 250px">{{ _t("Date/Times") }}:</th>
        <th style="width: 190px">{{ _t("Type") }}</th>
        <th style="width: 255px">{{ _t("Time Taken") }}</th>
        <th style="width: 190px">{{ _t("Amount") }}</th>
        <th style="width: 190px">{{ _t("Status") }}</th>
        <th style="width: 140px">{{ _t("Driver") }}</th>
        <th style="width: 205px">{{ _t("Agent") }}</th>
        <th style="width: 290px">{{ _t("Order Source") }}</th>
      </tr>
      <tr
        class="referal-code-customer"
        v-for="order in pastOrders"
        :key="order._id"
      >
        <td>#{{ order.order_no }}</td>
        <td>{{ order.created_at }}</td>
        <td>{{ order.order_type }}</td>
        <td>{{ convertDatetime(order.real_created_datetime) }}</td>
        <td>{{ order.balance_due }}</td>
        <td>{{ order.order_status }}</td>
        <td>
          {{
            LookupData.get({
              collection: users._id,
              matchWith: order.driver,
              selection: "name"
            })
          }}
        </td>
        <td>{{ order.created_by }}</td>
        <!--<td>Tecom</td>-->
        <td class="show-details-his">
          <span
            data-toggle="modal"
            data-target=".bd-example-modal-lg"
            data-dismiss="modal"
            @click="selectedOrderDetails(order._id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="13"
              viewBox="0 0 20 13"
            >
              <g fill="#27A83D" fill-rule="nonzero">
                <path
                  d="M10 12.971c-2.229 0-4.621-1.053-6.921-3.063A19.21 19.21 0 0 1 .263 6.884a.526.526 0 0 1 0-.608A19.21 19.21 0 0 1 3.08 3.25C5.379 1.245 7.77.187 10 .187s4.621 1.052 6.921 3.063a19.21 19.21 0 0 1 2.816 3.024.526.526 0 0 1 0 .608 19.21 19.21 0 0 1-2.816 3.026c-2.3 2.005-4.692 3.063-6.921 3.063zM1.363 6.58c.924 1.174 4.492 5.34 8.637 5.34 4.145 0 7.716-4.164 8.637-5.34-.924-1.174-4.492-5.34-8.637-5.34-4.145 0-7.716 4.164-8.637 5.34z"
                />
                <path
                  d="M10 10.39a3.81 3.81 0 1 1 3.713-3.811A3.766 3.766 0 0 1 10 10.389zm0-6.58a2.758 2.758 0 1 0 2.66 2.769A2.713 2.713 0 0 0 10 3.82v-.01z"
                />
              </g>
            </svg>
            {{ _t("Show Details") }}
          </span>
        </td>
      </tr>
    </table>

    <!--    <OrderDetailsPopup />-->
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import DateTime from "@/mixins/DateTime";
// import OrderDetailsPopup from '@/components/partial/OrderDetailPopup'
export default {
  name: "CustomerPastOrders",
  props: {
    pastOrders: {}
  },
  components: {
    // OrderDetailsPopup,
  },
  mixins: [DateTime],
  computed: {
    ...mapState({
      users: state => state.customer.lookups.users
    }),
    ...mapGetters("location", ["_t"])
  },
  methods: {
    ...mapActions("order", ["selectedOrderDetails"])
  }
};
</script>
