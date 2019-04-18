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
function hideModal(modalName) {
  $(modalName).modal('hide')
}
function hidePayNow() {
  $('div#pay-now').addClass('effect-screen')
  // $("div#pay-now").hide(800);
  $('div#pay-now').animate({ right: '-660px' })
  $('body').removeClass('modal-open')
  $('div#pay-now').removeClass('show')
  $('#transparent-screen').css('display', 'none')
}



/*
$(document).on('click', '.popover-btn ' , function(){
  var $this = $(this)
  $this.popover({
    placement : 'top',
    html : true,

    //title : 'hello ',
    content : '<div class="text-center innter-tooltip-pos">'+ $this.text() +'<div class="text-center"><a href="#" data-dismiss="alert" class="btn btn-success btn-block btn-sm btn-rouded remove-bottom-close ">Add Item</a></div></div>'
  })

})*/
