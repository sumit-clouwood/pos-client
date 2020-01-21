import * as CONST from '@/constants'

export default {
  methods: {
    formatItemDiscount(item) {
      if (item.discount) {
        let discountInfo = ''
        let discountStr = ''

        if (item.discount.type === CONST.VALUE) {
          discountInfo = item.discount.value
          discountStr = this.formatPrice(item.discount.value)
        } else if (item.discount.type === CONST.PERCENTAGE) {
          discountInfo = item.discount.rate + ' %'
          discountStr = item.discount.rate + ' %'
        } else if (item.discount.type === CONST.FIXED) {
          discountInfo =
            this.formatPrice(
              item.discount.value + this.itemModifiersPrice(item)
            ) +
            ' x ' +
            item.quantity

          discountStr = this.formatPrice(item.discount.value)
        }

        if (item.discount.type === CONST.FIXED) {
          return (
            '<s>' +
            this.formatPrice(this.itemGrossPrice(item)) +
            '</s> ' +
            discountInfo +
            ' ( ' +
            item.discount.name +
            ' - ' +
            discountStr +
            ' )'
          )
        } else {
          return (
            '@ ' +
            this.formatPrice(this.itemGrossPrice(item)) +
            ' x ' +
            item.quantity +
            ' - ' +
            discountInfo +
            ' ( ' +
            item.discount.name +
            ' - ' +
            discountStr +
            ' )'
          )
        }
      }
      return `@ ${this.formatPrice(this.itemGrossPrice(item))} x ${
        item.quantity
      }`
    },
  },
}
