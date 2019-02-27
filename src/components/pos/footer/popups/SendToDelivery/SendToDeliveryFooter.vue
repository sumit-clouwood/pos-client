<template>
  <div class="modal-footer">
    <div class="referal">
      <button
        type="button"
        data-value=""
        id="referal-btn"
        class="btn referal-btn dropdown-toggle"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Referal</button
      ><!--<span><img src="images/referal-down.png"></span>-->
      <div class="dropdown-menu">
        <a class="dropdown-item" data-value="Call Center" href="#"
          >Call Center</a
        >
        <a class="dropdown-item" data-value="Talabat" href="#">Talabat</a>
        <a class="dropdown-item" data-value="Talabat Credit" href="#"
          >Talabat Credit</a
        >
        <a class="dropdown-item" data-value="Zomato" href="#">Zomato</a>
        <a class="dropdown-item" data-value="Zomato Credit" href="#"
          >Zomato Credit</a
        >
        <a class="dropdown-item" data-value="Round Menu" href="#">Round Menu</a>
      </div>
      <button
        data-range="true"
        data-multiple-dates-separator=" - "
        class="btn btn-success btn-large datepicker-here"
        type="button"
        id="schedule-btn"
        data-timepicker="true"
        data-language="en"
      >
        Schedule
        <span><img src="img/pos/schedule-icon.png" alt="schedule"/></span>
      </button>
    </div>
    <div class="btn-announce">
      <button
        type="button"
        class="btn btn-danger cancel-announce"
        data-dismiss="modal"
      >
        <span>X</span> Close
      </button>
      <button
        class="btn btn-success btn-large"
        type="button"
        id="confirm_announcement"
      >
        Confirm
      </button>
    </div>
    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
  </div>
</template>

<script>
export default {
  name: 'SendToDeliveryFooter',
  props: {},
}
</script>
