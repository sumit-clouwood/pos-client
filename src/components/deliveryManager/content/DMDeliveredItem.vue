<template>
  <div class="delivered-order-table">
    <table class="table table-responsive">
      <tbody>
        <tr>
          <th style="width: 260px">DRIVER NAME</th>
          <th style="width: 150px">TOTAL DELIVERED</th>
          <th style="width: 190px">TOTAL AMOUNT</th>
          <th style="width: 255px">CASH AMOUNT</th>
          <th style="width: 190px">CREDIT AMOUNT</th>
          <th style="width: 190px">AVERAGE DELIVERY TIME</th>
          <th style="width: 250px"></th>
        </tr>
        <tr class="">
          <td>Iqbal University Sharjah</td>
          <td>11</td>
          <td>572.01</td>
          <td>444.51</td>
          <td>127.5</td>
          <td>00:00:07</td>

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
                  ></path>
                  <path
                    d="M10 10.39a3.81 3.81 0 1 1 3.713-3.811A3.766 3.766 0 0 1 10 10.389zm0-6.58a2.758 2.758 0 1 0 2.66 2.769A2.713 2.713 0 0 0 10 3.82v-.01z"
                  ></path>
                </g></svg
              ><span>Show Details</span></span
            >
            <small class="delivered-refresh-data"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 16 16"
                version="1.1"
                width="16px"
                height="16px"
              >
                <g id="surface1">
                  <path
                    style=" "
                    d="M 7.5 1.035156 C 3.917969 1.035156 1 3.941406 1 7.515625 L 1 8 L 2 8 L 2 7.515625 C 2 4.484375 4.457031 2.035156 7.5 2.035156 C 9.132813 2.035156 10.589844 2.75 11.59375 3.875 L 10.464844 5 L 14 5 L 14 1.476563 L 12.300781 3.167969 C 11.113281 1.863281 9.40625 1.035156 7.5 1.035156 Z M 13 7 L 13 7.5 C 13 10.542969 10.542969 13 7.5 13 C 5.859375 13 4.402344 12.277344 3.394531 11.140625 L 4.535156 10 L 1 10 L 1 13.535156 L 2.6875 11.847656 C 3.878906 13.164063 5.589844 14 7.5 14 C 11.085938 14 14 11.085938 14 7.5 L 14 7 Z "
                  />
                </g>
              </svg>
              <span>Refresh Data</span></small
            >
            <small class="delivered-hide"
              ><span>Hide</span> <img src="images/hide.png" alt="hide"
            /></small>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'DMDeliveredItem',
}
</script>

<style scoped></style>
