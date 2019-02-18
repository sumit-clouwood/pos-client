<template>
  <div class="modal-footer">
    <div class="pagination-customer-details">
      <ul class="ullist-pagination">
        <li class="next-page" id="previous-page">
          <img src="img/pos/back-arrow.png" alt="next-btn" />
        </li>
        <li>1</li>
        <li class="next-page" id="next-page">
          <img src="img/pos/next-arrow.png" alt="next-btn" />
        </li>
        <li>Last</li>
      </ul>
    </div>
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-danger cancel-announce"
        data-dismiss="modal"
      >
        <span>X</span>Cancel
      </button>
      <button
        class="btn btn-success btn-large popup-btn-save"
        type="button"
        id="cust-new"
        data-toggle="modal"
        data-target="#customer"
        data-dismiss="modal"
      >
        New Customer
      </button>
    </div>
    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
  </div>
</template>

<script>
export default {
  name: "ManageCustomerFooter",
  props: {}
};
</script>
