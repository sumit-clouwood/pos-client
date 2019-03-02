<template>
  <div class="manage-customer-table">
    <table class="table table-responsive">
      <tr>
        <th style="width: 190px">ORDER NUMBER</th>
        <th style="width: 250px">DATE & TIME</th>
        <th style="width: 190px">TYPE</th>
        <th style="width: 255px">TIME TAKEN</th>
        <th style="width: 190px">AMOUNT</th>
        <th style="width: 190px">STATUS</th>
        <th style="width: 190px">DRIVER</th>
        <th style="width: 205px">AGENT</th>
        <th style="width: 250px">SOURCE</th>
      </tr>
      <tr class="referal-code-customer">
        <td>#22537828</td>
        <td>My 28, 2018 6:19 pm</td>
        <td>Delivery</td>
        <td>28d 15h 53mins</td>
        <td>83.00</td>
        <td>Running</td>
        <td></td>
        <td>Tecom</td>
        <td class="show-details-his">
          <span
            ><svg
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
              </g></svg
            >Show Details</span
          >
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CustomerPastOrders',
}
</script>
