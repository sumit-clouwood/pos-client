/* global $ */
/* eslint-disable no-unused-vars */
$(document).ready(function() {
  // Configure/customize these variables.
  // How many characters are shown by default
  var showChar = 23
  // var ellipsestext = "...";
  var moretext = '...'
  var lesstext = 'Show less'

  $('.more').each(function() {
    var content = $(this).html()

    if (content.length > showChar) {
      var c = content.substr(0, showChar)
      var h = content.substr(showChar, content.length - showChar)

      var html =
        c +
        '<span class="morecontent"><span>' +
        h +
        '</span>&nbsp;&nbsp;<a href="" class="morelink">' +
        moretext +
        '</a></span>'

      $(this).html(html)
    }
  })

  $('.morelink').click(function() {
    if ($(this).hasClass('less')) {
      $(this).removeClass('less')
      $(this).html(moretext)
    } else {
      $(this).addClass('less')
      $(this).html(lesstext)
    }
    $(this)
      .parent()
      .prev()
      .toggle()
    $(this)
      .prev()
      .toggle()
    return false
  })
})
/*$('.main, .header').click(() => {
  alert('2')
  $('.multi-store-menu-pos').slideUp()
  $('.logo').removeClass('multistore')
})*/
$('#status-history').click(function() {
  $('div#dm-order-history-rec').show()
  $('button#recipt-history').show()
  $('div#dm-order-confirmation').hide()
  $('button#status-history').hide()
})

$(document).ready(function() {
  $('div.dropdown-menu a').click(function(e) {
    e.preventDefault() // cancel the link behaviour
    var selText = $(this).attr('data-value')
    $('button.btn.referal-btn').attr('data-value', selText)
    $('button.btn.referal-btn').text(selText)
  })

  $(document).mouseup(function(e) {
    var popup = $('#schedule-btn .datepicker, #schedule-btn')
    // var datesassign =$(".datepicker");
    if (
      !$('#schedule-btn').is(e.target) &&
      !popup.is(e.target) &&
      popup.has(e.target).length == 0
    ) {
      // icons.hide(500);
      $('#schedule-btn .datepicker').hide()
    }
  })

  $('#pay-now').addClass('animated fadeInRight')
  $('.amount-keypad').addClass('animated zoomIn')
  $('.holding-order-panel, .block1-wrap-dp, div#hide-block1-dp').addClass(
    'animated zoomIn'
  )
  $(
    '.order-wrappers-panel, div#dm-order-history-rec, button#recipt-history'
  ).addClass('animated zoomIn')

  // Increase amount
  $('.value-qty').on('click', function() {
    var $button = $(this)
    var oldValue = $button
      .parent()
      .find('input')
      .val()

    var newVal = 0
    if ($button.text() == '+') {
      newVal = parseFloat(oldValue) + 1
    } else {
      // Don't allow decrementing below zero
      if (oldValue > 0) {
        newVal = parseFloat(oldValue) - 1
      } else {
        newVal = 0
      }
    }

    $button
      .parent()
      .find('input')
      .val(newVal)
  })

  $(document).mouseup(function(e) {
    var popup = $(
      '.setting-dropdown, .setting-dropdown-transaction, #setting-icon'
    )
    var icons = $('.setting-dropdown, .setting-dropdown-transaction')

    // var datesassign =$(".datepicker");
    icons.hide(500)
    $('body').removeClass('active-body')
  })

  $('.input-image').click(function() {
    $('.amount-keypad').toggle()
  })

  $('.referal-code-customer').click(function() {
    $(this)
      .addClass('active')
      .siblings()
      .removeClass('active')
  })

  $(
    'div#navbarResponsive.delivery-manager-st ul#exampleAccordion > li.nav-item > a'
  ).click(function() {
    $(
      'div#navbarResponsive.delivery-manager-st ul#exampleAccordion > li.nav-item > a'
    ).removeClass('active')
    $(this).addClass('active')
  })

  $('.order-location.option-contain, ul#exampleAccordion-dine > li').click(
    function() {
      $(
        '.order-location.option-contain, ul#exampleAccordion-dine > li'
      ).removeClass('active')
      $(this).addClass('active')
    }
  )
  $('#display-order .order-location.option-contain').click(function() {
    $('#display-order .order-location.option-contain').removeClass('active')
    $(this).addClass('active')
  })

  $('button.ready > a').click(function() {
    $(this)
      .parent()
      .parent()
      .parent()
      .addClass('active')
    $('.dm-contain-order.active').hide(800)
  })

  $('.pizza-size-wrapper > div').click(function() {
    $('.pizza-size-wrapper > div').removeClass('active')
    $(this).addClass('active')
  })
  $('.food-menu-item').click(function() {
    $('.food-menu-item').removeClass('active')
    $(this).addClass('active')
  })
  $('ul.ullist-pagination > li.order-pagination').click(function() {
    $('ul.ullist-pagination > li.order-pagination').removeClass('active')
    $(this).addClass('active')
  })

  // dm
  $('div.dm-order-screen-change').each(function() {
    $(this).hide()
    if ($(this).attr('id') == 'home-delivery-order') {
      $(this).show()
    }
  })

  $('.dm-btn').on('click', function(e) {
    e.preventDefault(e)
    var id = $(this).attr('data-related')
    $('div.dm-order-screen-change').each(function() {
      $(this).hide()
      if ($(this).attr('id') == id) {
        $(this).show()
      }
    })
  })

  // For views show
  $('.views-btn').on('click', function(e) {
    e.preventDefault(e)
    var id = $(this).attr('data-related')
    var nw = $('<div>', {
      class: 'ui-rotatable-handle',
    })
    var ne = nw.clone()
    var se = nw.clone()
    $('.inner-dinein-table > span').each(function() {
      $(this).removeClass('editable-view')
      if ($(this).attr('id') == id) {
        $(this).addClass('editable-view')
        $('.sitting-dine-wrap, .dining-section .inner-dinein-table').sortable()
        $('span.editable-view > img')
          .sortable()
          .rotatable()
          .resizable()
        $('span.editable-view div.ui-rotatable-handle').addClass(
          'ui-rotatable-handle-sw'
        )
        nw.addClass('ui-rotatable-handle-nw')
        ne.addClass('ui-rotatable-handle-ne')
        se.addClass('ui-rotatable-handle-se')
        // Assign handles to box
        $('span.editable-view').append(nw, ne, se)
        $("span.editable-view div[class*='ui-rotatable-handle-']").bind(
          'mousedown',
          function(e) {
            $('span.editable-view')
              .rotatable('instance')
              .startRotate(e)
          }
        )
      }
    })
  })
  // End Views show

  // More text show
  $(document).on('click', '.popover-btn ', function() {
    var $this = $(this)
    $this.popover({
      placement: 'top',
      html: true,

      //title : 'hello ',
      content:
        '<div class="text-center innter-tooltip-pos">' +
        $this.text() +
        '<div class="text-center"><a role="button" data-dismiss="alert" class="btn btn-success btn-block btn-sm btn-rouded remove-bottom-close ">Add Item</a></div></div>',
    })
  })

  $('html').on('click', function(e) {
    if (
      typeof $(e.target).data('original-title') == 'undefined' &&
      !$(e.target)
        .parents()
        .is('.popover.in')
    ) {
      $('[data-original-title]').popover('hide')
    }
  })

  $(document).ready(function() {
    var XX = 15
    $('.vegetable .remove-bottom')
      .filter(function() {
        return $(this).text().length > XX
      })
      .addClass('popover-btn')
  })
  // End More text-show

  // li dropdown
  /*$('div.dm-ready-order-wrapper').each(function() {
    $(this).hide()
    if ($(this).attr('id') == 'dm-new-order') {
      $(this).show()
    }
  })*/

  $('.all-tables-wrap > button').on('click', function(e) {
    e.preventDefault(e)
    var id = $(this).attr('data-related')
    $('div.dm-ready-order-wrapper, div.container-fluid').each(function() {
      $(this).hide()
      if ($(this).attr('id') == id) {
        $(this).show()
      }
    })
  })

  $('button.dm-btn, .all-tables-wrap > button').click(function() {
    $('button.dm-btn, .all-tables-wrap > button').removeClass('active')
    $(this).addClass('active')
  })
  $(
    '.dining-section div.sitting-tbl, .dining-section .sitting-tbl-long, .dining-section .sitting-tbl-large'
  ).click(function() {
    $(
      '.dining-section div.sitting-tbl, .dining-section .sitting-tbl-long, .dining-section .sitting-tbl-large'
    ).removeClass('active')
    $(this).addClass('active')
  })
  $(
    '.dining-section div.sitting-tbl, .dining-section .sitting-tbl-long, .dining-section .sitting-tbl-large'
  ).click(function() {
    $(
      '.dining-section div.sitting-tbl, .dining-section .sitting-tbl-long, .dining-section .sitting-tbl-large'
    )
      .parent()
      .removeClass('active')
    $(this)
      .parent()
      .addClass('active')
  })
  $('ul.ullist-floor > li,  ul.ullist-dining-area > li').click(function() {
    $('ul.ullist-floor > li,  ul.ullist-dining-area > li').removeClass('active')
    $(this).addClass('active')
  })
  $('ul.dining-edit-tbl > li').click(function() {
    $('ul.dining-edit-tbl > li').removeClass('active')
    $(this).addClass('active')
  })
  $('li.hide-dining-tbl').click(function() {
    $(this)
      .parent()
      .parent()
      .parent()
      .addClass('active')
    $('.sitting-image.active').css('opacity', 0)
  })

  //  For Tip Amount

  $('div#add-tip-amt').click(function() {
    $('div#pay-now').addClass('active')
  })
  $(document).mouseup(function() {
    // var datesassign =$(".datepicker");

    $('div#pay-now').removeClass('active')
  })

  // Dropdown toggle
  $('li.nav-item.arrow-bottom > a > .bt-arrow').click(function(e) {
    e.preventDefault()
    var aaa = 0
    $('#exampleAccordion li').each(function() {
      aaa = aaa + $(this).innerHeight()
    })
    var bbb = $('#exampleAccordion').innerHeight()

    if (aaa > bbb) {
      $('#exampleAccordion')
        .stop()
        .animate({ top: bbb - aaa + 'px' }, 800)
    } else {
      // $("#exampleAccordion").animate({'top':(aaa - bbb)+'px'},800);
      $('.top-arrow').css('display', 'none')
      // alert('No Items downside')
    }
    $('.bt-arrow').css('display', 'none')
    $('.top-arrow').css('display', 'block')
    return false
  })

  $('li.nav-item.arrow-bottom > a > .top-arrow').click(function(e) {
    e.preventDefault()
    $('#exampleAccordion')
      .stop()
      .animate({ top: 0 + 'px' }, 800)
    $('.bt-arrow').css('display', 'block')
    $('.top-arrow').css('display', 'none')
    return false
  })

  $('.last-order-wrap').length &&
    $('.last-order-wrap').slick({
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      nextArrow: '<img class="next-btn" src="img/pos/next-arrow.png"/>',
      prevArrow: '<img class="back-btn" src="img/pos/back-arrow.png"/>',
    })

  $('.br-table-btn').click(function() {
    $('.last-order-wrap')[0].slick.refresh()
  })
})
// for delivery manger transparent-screen

$(document).ready(function() {
  if ($(window).width() >= 320 && $(window).width() <= 991) {
    $('.cross').hide()
    $('div#left-fixed-menu').click(function() {
      $('div.delivery-manager-st#navbarResponsive > ul').show(400)
    })
    $('li.nav-item.logo-wrap').click(function() {
      $('div.delivery-manager-st#navbarResponsive > ul').hide(400)
      $('.tooltip').removeClass('show')
    })

    $('div.delivery-manager-st#navbarResponsive > ul > li').click(function() {
      $('div.delivery-manager-st#navbarResponsive > ul').hide(400)
      $('.tooltip').removeClass('show')
    })
  }
})

$(document).ready(function() {
  $('.sitting-image .tbl-number').click(function() {
    $('#dine-in-wrapper .orders-panel').animate({ right: '0' }, 400)
    $('#dine-in-wrapper').removeClass('full-dinein')
  })
  $('.sitting-image').on('dblclick', function(event) {
    event.preventDefault()
    var url = $(this).data('target')
    location.replace(url)
  })
})

// view image rotateble

$(function() {
  $('.autotbl').click(function() {
    $('ul.dp-dropdown-content.edit-tbl-nmbr').stop()
    // Prepare extra handles
    var nw = $('<div>', {
      class: 'ui-rotatable-handle',
    })
    var ne = nw.clone()
    var se = nw.clone()
    // Assign Rotatable
    $('.sitting-image.active').rotatable()
    // Assign coordinate classes to handles
    $('.sitting-image.active div.ui-rotatable-handle').addClass(
      'ui-rotatable-handle-sw'
    )
    nw.addClass('ui-rotatable-handle-nw')
    ne.addClass('ui-rotatable-handle-ne')
    se.addClass('ui-rotatable-handle-se')
    // Assign handles to box
    $('.sitting-image.active').append(nw, ne, se)
    // Assigning bindings for rotation event
    $(".sitting-image.active div[class*='ui-rotatable-handle-']").bind(
      'mousedown',
      function(e) {
        $('.sitting-image.active')
          .rotatable('instance')
          .startRotate(e)
      }
    )
  })
})
// End View image rotateble

$(document).ready(function() {
  $('.referal-code-customer').on('click', function() {
    $(this)
      .addClass('active')
      .siblings()
      .removeClass('active')
  })
})
