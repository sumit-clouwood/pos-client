/* CATEGORY SECTION */
export const REFERENCE_FIELD_SUBCATEGORY_TO_CATEGORY = 'category'
export const REFERENCE_FIELD_CATEGORY_TO_SUBCATEGORY = '_id'

export const REFERENCE_FIELD_ITEM_TO_CATEGORY = 'category'
export const REFERENCE_FIELD_CATEGORY_TO_ITEM = '_id'

export const REFERENCE_FIELD_ITEM_TO_SUBCATEGORY = 'sub_category'
export const REFERENCE_FIELD_SUBCATEGORY_TO_ITEM = '_id'
export const ORDER_HISTORY_TYPE_RECORD_NEW = 'Created'
export const ORDER_HISTORY_TYPE_RECORD_SENT_TO_KITCHEN =
  'Sent for Cooking/Assembly'
export const ORDER_HISTORY_TYPE_RECORD_PRINTED = 'Printed'
export const ORDER_HISTORY_TYPE_RECORD_READY = 'Ready'
export const ORDER_HISTORY_TYPE_RECORD_DELIVERY_STARTED = 'Delivery Started'
export const ORDER_HISTORY_TYPE_RECORD_DELIVERED = 'Delivered'

/* PAYMENT RELATED CONSTANTS */

export const LOYALTY = 'loyalty'
export const GIFT_CARD = 'gift_card'

/* MODULE RELATED CONSTENTS */

export const MODULE_INVENTORY = 'Inventory Management'
export const MODULE_CASHIER_APP = 'Cashier Apps'
export const MODULE_STAFF_CONTROL = 'Staff Management'
export const MODULE_ANNOUNCEMENTS = 'Announcements'
export const MODULE_FEEDBACK = 'Feedbacks'
export const MODULE_GIFT_CARDS = 'Gift Cards'
export const MODULE_LOYALTY = 'Loyalty'
export const MODULE_INVOICE_PRINTING = 'Invoice Printing'
export const MODULE_WEBSITE = 'Website'
export const MODULE_SURCHARGES_AND_DISCOUNTS = 'Surcharges & Discounts'
export const MODULE_DELIVERY = 'Delivery Manager'
export const MODULE_DISPATCH = 'Dispatch Screen'
export const MODULE_CRM = 'CRM'
export const MODULE_CASH_MANAGEMENT = 'Cash Management'
export const MODULE_DINEIN = 'Dine-In'
export const MODULE_POS = 'Point of Sale'
export const MODULE_OFFLINE_ORDERS = 'Offline Orders'
export const MODULE_FUTURE_ORDERS = 'Future Orders'

/* order related constants */

export const ORDER_STATUS_ON_HOLD = 'on-hold'
export const ORDER_STATUS_RESERVED = 'reserved'
export const ORDER_STATUS_ON_WAY = 'on-a-way'
export const ORDER_STATUS_IN_DELIVERY = 'in-delivery'
export const ORDER_STATUS_IN_PROGRESS = 'in-progress'
export const ORDER_TYPE_CALL_CENTER = 'call_center'
export const ORDER_TYPE_DINE_IN = 'dine_in'
export const ORDER_TYPE_CARHOP = 'carhop'
export const ORDER_STATUS_READY = 'ready'
export const ORDER_STATUS_ON_A_WAY_TO_FINISH = 'on-a-way'
export const ORDER_STATUS_FINISHED = 'finished'
export const ORDER_STATUS_COMPLETED = 'completed'
export const ORDER_SOURCE_POS = 'cashier_app'
export const ORDER_PAYMENT_TYPE_LOYALTY = 'Loyalty Points'

export const PERCENTAGE = 'percentage'
export const VALUE = 'value'

export const LOADING_STATUS_LOADING = 'LOADING...'
export const LOADING_STATUS_DONE = 'DONE'

export const DISCOUNT_ITEM_ERROR_GREATER =
  "Discount can't be greater than item price."
export const DISCOUNT_ITEM_ERROR_FREE =
  'Item discount not available for free items.'
export const DISCOUNT_ITEM_ERROR_ORDER =
  'Please remove order discount to apply item discount.'
export const DISCOUNT_ORDER_ERROR_ITEM =
  'Please add some item(s) to cart before applying order discount.'
export const DISCOUNT_ORDER_ERROR_ITEM_DISCOUNT =
  'Please remove item level discount(s) first to apply order discount.'
export const DISCOUNT_ORDER_ERROR_TOTAL =
  "Discount can't be greater than total amount of an order."
