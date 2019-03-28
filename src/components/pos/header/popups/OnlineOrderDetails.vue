<template>
  <div class="modal fade" id="past-order" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->

      <div class="modal-content">
        <div class="modal-body order-confirmation-wrap">
          <div class="past-order-details-wrap">
            <div class="sidebar-past-order">
              <h4>Placed By</h4>
              <p>Tecom</p>
            </div>
            <div class="sidebar-past-order">
              <h4>Order Date & Time</h4>
              <p>28 May 2018 06:18pm</p>
            </div>
            <div class="sidebar-past-order">
              <h4>Order Time</h4>
              <p>28 days 16 hrs 42 mins</p>
            </div>
            <div class="sidebar-past-order">
              <h4>Driver</h4>
              <p>Not Assigned</p>
            </div>
          </div>
          <div class="past-order-confirmation">
            <h1 class="order-id">Order 2253728</h1>
            <div class="order-table">
              <table class="table table-responsive">
                <tr>
                  <th style="width: 300px">ITEM NAME</th>
                  <th style="width: 100px">QTY</th>
                  <th style="width: 150px">PRICE</th>
                  <th style="width: 100px">TAX</th>
                  <th style="width: 150px">SUBTOTAL</th>
                </tr>
                <tr>
                  <td>Vegetable Pizza Small</td>
                  <td>2</td>
                  <td>21.00</td>
                  <td>0.00</td>
                  <td>21.00</td>
                </tr>
                <tr class="pay-tot-amt">
                  <td>Pepsi</td>
                  <td>2</td>
                  <td>21.00</td>
                  <td>0.00</td>
                  <td>21.00</td>
                </tr>
                <tr>
                  <td>Vegetable Pizza Small</td>
                  <td>2</td>
                  <td>21.00</td>
                  <td>0.00</td>
                  <td>21.00</td>
                </tr>
                <tr class="pay-tot-amt">
                  <td>Pepsi</td>
                  <td>2</td>
                  <td>21.00</td>
                  <td>0.00</td>
                  <td>21.00</td>
                </tr>
                <tr>
                  <td>Vegetable Pizza Small</td>
                  <td>2</td>
                  <td>21.00</td>
                  <td>0.00</td>
                  <td>21.00</td>
                </tr>
                <tr class="pay-tot-amt">
                  <td>Pepsi</td>
                  <td>2</td>
                  <td>21.00</td>
                  <td>0.00</td>
                  <td>21.00</td>
                </tr>
              </table>
            </div>
            <div id="total-order-past-wrap" class="total-order">
              <div class="order-confirm-amt" id="past-confirm-order">
                <div class="order-amt-title">
                  <p>SUBTOTAL :</p>
                  <p>SURCHARGE :</p>
                  <p>ORDER DISCOUNT :</p>
                  <p>TAX :</p>
                  <p>BILL AMOUNT :</p>
                </div>
                <div class="order-amt-charges">
                  <p>INR 42.00</p>
                  <p>INR 0.00</p>
                  <p>INR 0.00</p>
                  <p>INR 0.00</p>
                  <p>INR 42.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="referal">
            <button type="button" class="btn view-history" id="view-history">
              View History
            </button>
            <button
              class="btn btn-success btn-large"
              type="button"
              id="modify-btn"
            >
              <span
                ><img
                  src="/pos/img/edit-icon.png"
                  alt="schedule"/></span
              >Modify
            </button>
          </div>
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              <span>âœ•</span> Close
            </button>
            <button type="button" class="btn btn-danger cancel-announce">
              Cancel Order
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  name: 'OnlineOrderDetails',
}
</script>
