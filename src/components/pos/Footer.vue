<template>
  <div>
    <footer class="sticky-footer">
      <div class="container">
        <ul class="ullist-icons">
          <li data-toggle="modal" data-target="#manage-customer">
            <a href="#"
              ><img src="img/pos/customer.svg" alt="customer" /><span
                >Customer</span
              ></a
            >
          </li>
          <li id="hold-order-box">
            <!-- <a href="#"><img class="hold-orders-show" src="images/footer-images/s.png" alt="customer"><img class="hold-order" src="images/hold-order.png" alt="customer"><span>Hold Orders</span></a>-->
            <a href="#"
              ><img class="hold-orders-show" src="img/pos/hold.svg" /><img
                class="hold-ordes"
                src="img/pos/hold-order.svg"
              /><span>Hold Orders</span></a
            >
          </li>
          <li
            data-toggle="modal"
            data-target="#order-confirmation"
            data-dismiss="modal"
          >
            <a href="#"
              ><img src="img/pos/delivery.svg" /><span
                >Send to Delivery</span
              ></a
            >
          </li>
          <li
            class="active"
            data-toggle="modal"
            data-target="#select-discount"
            id="discount-footer"
          >
            <a href="#"
              ><img src="img/pos/discount.svg" /><span>Select Discount</span></a
            >
          </li>
          <li data-toggle="modal" data-target="#dining-option">
            <a href="#"
              ><img src="img/pos/dining.svg" /><span>Dinning Options</span></a
            >
          </li>
          <li data-toggle="modal" data-target="#add-note">
            <a href="#"
              ><img src="img/pos/notes.svg" alt="note" /><span
                >Add Note</span
              ></a
            >
          </li>
        </ul>
        <ul class="template-btn">
          <li class="pay-now">
            <a href="#"
              ><img src="img/pos/payment.svg" alt="payment" /><span
                class="pay-btn"
                >Pay Now</span
              ></a
            >
          </li>
        </ul>
      </div>
    </footer>
    <div class="modal-backdrop fade show" id="transparent-screen"></div>

    <!--All popup including online order, because we need to apply few js which are not on header so all popups will be here-->
    <DineIn />
    <AddNote />
    <Discount />
    <OnlineOrder />
    <SendToDelivery />
    <ManageCustomer />
    <OrderItemPopup />
    <CustomerCreate />
    <CustomerAddress />
    <CartItemDiscount />
    <SelectCustomerAddress />
    <CustomerInformation />
    <CustomerNote />
  </div>
</template>

<script>
import DineIn from './footer/popups/DineIn'
import AddNote from './footer/popups/AddNote'
import Discount from './footer/popups/Discount'
import OnlineOrder from './header/popups/OnlineOrder'
import SendToDelivery from './footer/popups/SendToDelivery'
import ManageCustomer from './footer/popups/ManageCustomer'
import CartItemDiscount from './footer/popups/CartItemDiscount'
import OrderItemPopup from './content/cart/newOrders/items/Popup'
import CustomerNote from '../pos/footer/popups/ManageCustomer/CustomerNote'
import CustomerCreate from '../pos/footer/popups/ManageCustomer/CustomerCreate'
import CustomerAddress from '../pos/footer/popups/ManageCustomer/CustomerAddress/CustomerAddress'
import CustomerInformation from './footer/popups/ManageCustomer/CustomerInformation'
import SelectCustomerAddress from '../pos/footer/popups/ManageCustomer/CustomerAddress/SelectCustomerAddress'

export default {
  name: 'Footer',
  props: {},
  components: {
    DineIn,
    AddNote,
    Discount,
    OnlineOrder,
    CustomerNote,
    ManageCustomer,
    SendToDelivery,
    OrderItemPopup,
    CustomerCreate,
    CustomerAddress,
    CartItemDiscount,
    SelectCustomerAddress,
    CustomerInformation,
  },
}
</script>
