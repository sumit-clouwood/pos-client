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
  $('div#pay-now').animate({right: '-660px'})
  $('body').removeClass('modal-open')
  $('div#pay-now').removeClass('show')
  $('#transparent-screen').css('display', 'none')
}

window.onload = function () {
  var getUrl = window.location.hash.substr(1)
  if (getUrl == '/dm') {
    $('body').addClass('dm-manager')
    $('body').removeClass('dinein')
  } else if (getUrl == '/dine-in/') {
    $('body').removeClass('dm-manager')
    $('body').addClass('dinein')
  } else {
    $('body').removeClass('dm-manager')
    $('body').removeClass('dinein')
  }
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
