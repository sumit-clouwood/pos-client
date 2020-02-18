<template>
  <div class="modal fade" id="business-summary" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Business Summary Details') }}
          </h4>
        </div>
        <div class="modal-body row business-summary">
          <div class="business-summary-wrapper">
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>
                      {{ _t('Sales') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th>
                      {{ _t('Value') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ _t('Gross Sales') }}</td>
                    <td class="align-right">4333 NZD</td>
                  </tr>
                  <tr>
                    <td>{{ _t('Item Discounts') }}</td>
                    <td class="align-right">4333 NZD</td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td>{{ _t('Order Discounts') }}</td>
                    <td class="align-right">4333 NZD</td>
                  </tr>
                  <tr>
                    <td>{{ _t('Net Sales Before Surcharge') }}</td>
                    <td class="align-right">4333 NZD</td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td>{{ _t('Surcharges') }}</td>
                    <td class="align-right">4333 NZD</td>
                  </tr>
                  <tr>
                    <td>{{ _t('Net Sales') }}</td>
                    <td class="align-right">4333 NZD</td>
                  </tr>
                  <tr>
                    <td>{{ _t('Tax') }}</td>
                    <td class="align-right">4333 NZD</td>
                  </tr>
                  <tr>
                    <td>{{ _t('Total Collected') }}</td>
                    <td class="align-right">4333 NZD</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>
                      {{ _t('Orders') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th>
                      {{ _t('Oty') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ _t('Total Orders') }}</td>
                    <td class="align-right">3</td>
                  </tr>
                  <tr>
                    <td>{{ _t('Cancelled Orders') }}</td>
                    <td class="align-right">3</td>
                  </tr>
                  <tr>
                    <td>{{ _t('Modified Orders') }}</td>
                    <td class="align-right">3</td>
                  </tr>
                  <tr>
                    <td>{{ _t('Not Finished Orders') }}</td>
                    <td class="align-right">3</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>
                      {{ _t('Payment Types') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th>
                      {{ _t('Qty') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                    <th>
                      {{ _t('Value') }}
                      <span><i class="fa fa-sort" aria-hidden="true"></i></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ _t('Cash') }}</td>
                    <td class="align-right">3</td>
                    <td class="align-right">162.89 NZD</td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td>{{ _t('Tota') }}</td>
                    <td class="align-right">3</td>
                    <td class="align-right">162.89 NZD</td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td>{{ _t('Tips') }}</td>
                    <td class="align-right">3</td>
                    <td class="align-right">162.89 NZD</td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td>{{ _t('Unfinished Dine-In Orders') }}</td>
                    <td class="align-right">3</td>
                    <td class="align-right">162.89 NZD</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              data-dismiss="modal"
            >
              {{ _t('Ok') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End Select Discount -->
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BusinessSummary',
  data() {
    return {}
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>
