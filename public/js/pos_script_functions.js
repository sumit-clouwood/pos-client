/* global $  */
/* eslint-disable no-unused-vars */
function closeModal(modalName) {
  $('body').removeClass('modal-open')
  $('#transparent-screen').css('display', 'none')
  $(modalName).modal('hide')
}

function showModal(modalName) {
  $(modalName).modal('show')
}

function hidePayNow() {
  $('div#pay-now').addClass('effect-screen')
  // $("div#pay-now").hide(800);
  $('div#pay-now').animate({ right: '-660px' })
  $('body').removeClass('modal-open')
  $('div#pay-now').removeClass('show')
  $('#transparent-screen').css('display', 'none')
}
