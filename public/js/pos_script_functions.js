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

function showPaymentBreak() {
  $('.amount-keypad').hide(100)
  $('#payment-breakdown').fadeIn()
}

function clickPayNow() {
  $('#payment-method')
    .not('.slick-initialized')
    .slick({
      arrows: false,
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 4,
      dots: true,
    })
  // $('body').append("<div class="modal-backdrop fade show"></div>");
  $('div#pay-now').animate({ right: '0' }, 800)
  $('div#pay-now').addClass('effect-screen')
  $('div#pay-now').css('display', 'block')
  $('#transparent-screen').css('display', 'block')

  $('body').addClass('modal-open')
  $('div#pay-now').addClass('show')
  $('div#pay-now').addClass('animated fadeInLeft')
  $('.modal-body.pay-now-block').css('opacity', '1')

  setTimeout(function() {
    $('.payment-method-block table td img').click(function() {
      if ($('.payment-method-block').length) {
        $('.payment-method-block').addClass('active')
        //$('.payment-method-block').hide(800)
      }
    })
  }, 300)
  if ($('body').find('#payment-method').length > 0) {
    $('#payment-method')[0].slick.refresh()
  }
}

function posConfigLinks() {
  let body = $('body')
  if (body.hasClass('active-body')) {
    body.removeClass('active-body')
  } else {
    body.addClass('active-body')
  }
  $('.setting-dropdown').toggle()
  $('.setting-dropdown').addClass('animated zoomIn')
}

function deliveryTabs(id) {
  $('.dm-ready-order-wrapper').hide()
  $('#' + id).hide()
  $('div.dm-ready-order-wrapper, div.container-fluid').each(function() {
    if ($(this).attr('id') === id) {
      $('#home-delivery-order')
        .find('#' + id)
        .css('display', 'grid')
    }
  })
}
