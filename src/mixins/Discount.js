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
            this.qtyString(item)

          discountStr = this.formatPrice(item.discount.value)
        }

        if (item.discount.type === CONST.FIXED) {
          return (
            '<s>' +
            this.formatPrice(this.itemUnitPrice(item)) +
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
            this.formatPrice(this.itemUnitPrice(item)) +
            ' x ' +
            this.qtyString(item) +
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
      return `@ ${this.formatPrice(
        this.itemUnitPrice(item)
      )} x ${this.qtyString(item)}`
    },
    itemUnitPrice(item) {
      if (item.item_type === CONST.SCALE_ITEM_TYPE) {
        return item.originalValue
      } else {
        return this.itemGrossPrice(item)
      }
    },
    qtyString(item) {
      if (item.item_type === CONST.SCALE_ITEM_TYPE) {
        return item.measurement_value + ' ' + item.measurement_unit
      } else {
        return item.quantity
      }
    },
  },
}
