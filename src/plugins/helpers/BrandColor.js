/* global $ */
export default {
  applyColoring: function(Brand) {
    // eslint-disable-next-line no-console
    console.log(Brand)
    $('.color-button').css('background-color', Brand['color-button'])
    $('.color-dashboard-background').css(
      'background-color',
      Brand['color-dashboard-background']
    )
    $('.color-icon-table-neutral-button').css(
      'background-color',
      Brand['color-icon-table-neutral-button']
    )
    $('.color-main').css('background-color', Brand['color-main'])
    $('.color-secondary').css('background-color', Brand['color-secondary'])
    $('.color-shadow').css('background-color', Brand['color-shadow'])
    $('.color-tables-background').css(
      'background-color',
      Brand['color-tables-background']
    )
    $('.color-text-invert').css('background-color', Brand['color-text-invert'])
    $('.color-warning').css('background-color', Brand['color-warning'])
    $('.color-text').css('background-color', Brand['color-text'])
  },
}
