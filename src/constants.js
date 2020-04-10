/* CATEGORY SECTION */
export const REFERENCE_FIELD_SUBCATEGORY_TO_CATEGORY = 'category'
export const REFERENCE_FIELD_CATEGORY_TO_SUBCATEGORY = '_id'

export const REFERENCE_FIELD_ITEM_TO_CATEGORY = 'category'
export const REFERENCE_FIELD_CATEGORY_TO_ITEM = '_id'
export const REFERRAL_TYPE_COD = 'cod'
export const REFERENCE_FIELD_ITEM_TO_SUBCATEGORY = 'sub_category'
export const REFERENCE_FIELD_SUBCATEGORY_TO_ITEM = '_id'
export const ORDER_HISTORY_TYPE_RECORD_NEW = 'Created'
export const ORDER_HISTORY_TYPE_RECORD_SENT_TO_KITCHEN =
  'Sent for Cooking/Assembly'
export const ORDER_HISTORY_TYPE_RECORD_NEW_FROM_MODIFIED =
  'ORDER_HISTORY_TYPE_RECORD_NEW_FROM_MODIFIED'
export const ORDER_HISTORY_TYPE_RECORD_PRINTED = 'Printed'
export const ORDER_HISTORY_TYPE_RECORD_READY = 'Ready'
export const ORDER_HISTORY_TYPE_RECORD_DELIVERY_STARTED = 'Delivery Started'
export const ORDER_HISTORY_TYPE_RECORD_DELIVERED = 'Delivered'
export const ORDER_HISTORY_TYPE_RECORD_UPDATED =
  'ORDER_HISTORY_TYPE_RECORD_UPDATED'
export const ORDER_HISTORY_TYPE_RECORD_CANCELLED =
  'ORDER_HISTORY_TYPE_RECORD_CANCELLED'
export const ORDER_HISTORY_TYPE_RECORD_MODIFIED =
  'ORDER_HISTORY_TYPE_RECORD_MODIFIED'
export const ORDER_HISTORY_TYPE_RECORD_COLLECTED_BY_USER =
  'Collected by Cashier'
export const ORDER_SYSTEM_STATUS_CANCELLED = 'cancelled'
export const ORDER_SYSTEM_STATUS_MODIFIED = 'modified'

/* PAYMENT RELATED CONSTANTS */

export const LOYALTY = 'loyalty'
export const GIFT_CARD = 'gift_card'
export const AGGREGATOR = 'aggregator'
export const CASH = 'cash'

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
export const MODULE_DINE_IN_MENU = 'Dine-In Menu'

/* order related constants */

export const ORDER_STATUS_ON_HOLD = 'on-hold'
export const ORDER_STATUS_RESERVED = 'reserved'
export const ORDER_STATUS_ON_WAY = 'on-a-way'
export const ORDER_STATUS_IN_DELIVERY = 'in-delivery'
export const ORDER_STATUS_IN_PROGRESS = 'in-progress'
export const ORDER_TYPE_CALL_CENTER = 'call_center'
export const ORDER_TYPE_DINE_IN = 'dine_in'
export const ORDER_TYPE_CARHOP = 'carhop'
export const ORDER_TYPE_WALKIN = 'walk_in'
export const ORDER_TYPE_TAKEAWAY = 'takeaway'
export const ORDER_STATUS_READY = 'ready'
export const ORDER_STATUS_ON_A_WAY_TO_FINISH = 'on-a-way'
export const ORDER_STATUS_FINISHED = 'finished'
export const ORDER_STATUS_COMPLETED = 'completed'
export const ORDER_SOURCE_POS = 'cashier_app'
export const ORDER_PAYMENT_TYPE_LOYALTY = 'Loyalty Points'

export const PERCENTAGE = 'percentage'
export const VALUE = 'value'
export const FIXED = 'fixed_price'

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
export const DISCOUNT_ORDER_ERROR_CART =
  'Cart amount is less than minimum required for this discount.'
export const DISCOUNT_ORDER_ERROR_MAX =
  'Cart amount is greater than maximum allowed for this discount.'
export const REGULAR_ITEM_TYPE = 'regular'
export const COMBO_ITEM_TYPE = 'combo_item'
