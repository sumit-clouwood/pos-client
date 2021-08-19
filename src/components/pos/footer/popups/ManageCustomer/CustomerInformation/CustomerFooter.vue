<template>
  <div class="modal-footer">
    <!--<div class="pagination-customer-details">
      <ul class="ullist-pagination">
        <li class="order-pagination active">1</li>
        <li class="order-pagination">2</li>
        <li class="order-pagination">3</li>
        <li class="order-pagination">4</li>
        <li class="next-page" id="next-page">
          <img src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/next-arrow.png" alt="next-btn" />
        </li>
        <li>Last</li>
      </ul>
    </div>-->
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-danger cancel-announce"
        data-dismiss="modal"
      >
        <span>X</span> Dismiss
      </button>
    </div>
    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
  </div>
</template>

<script>
export default {
  name: 'CustomerFooter',
}
</script>
