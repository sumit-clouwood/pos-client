<template>
  <div>
    <div class="modal-header">
      <h5 class="modal-title" id="POSItemOptionsTitle">
        Papperoni Pizza Small
      </h5>
      <button
        type="button"
        class="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-details">
      <div class="POSItemOptions_pricequantity">
        <div class="POSItemOptions_price">
          <label class="POSItemOptions_label">Price</label>
          <div class="POSItemOptions_money">AED 42.60</div>
        </div>
        <div class="POSItemOptions_quantity">
          <label class="POSItemOptions_label">Quantity</label>
          <div class="POSItemOptions_quantity_wrapper">
            <div class="POSItemOptions_quantity_inputs">
              <!-- <input type='button' value='-' class='qtyminus value-qty' field='quantity'/> -->
              <button class="qtyminus value-qty">-</button>
              <input
                type="text"
                name="quantity"
                value="1"
                min="1"
                class="qty"
              />
              <button class="qtyplus value-qty">+</button>
              <!-- <input type='button' value='+' class='qtyplus value-qty' field='quantity'/> -->
            </div>
            <div class="POSItemOptions_quantity_submit">
              <button>
                <img src="img/pos/right.png" alt="check" /> Set Quantity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemModifierHeader',
  props: {},
}
</script>
