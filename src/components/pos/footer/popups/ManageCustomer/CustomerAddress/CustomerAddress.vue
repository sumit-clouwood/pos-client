<template>
  <!--Add Address popup-->

  <div class="modal fade" id="add_address" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Add New Address</h4>
        </div>
        <div class="modal-body row form-block">
          <div class="col-md-6 left-form add-address-form">
            <div class="name-from">
              <label>Delivery Area <span>*</span></label>
              <input type="text" name="Name" />
              <span class="validation-error"
                >Delivery area is already exit.</span
              >
            </div>
            <div class="mobile-from">
              <label>Location/Branch <span>*</span></label>
              <select class="selectpicker">
                <option></option>
                <option>X</option>
                <option>Y</option>
              </select>
              <span class="validation-error">Building is already exit.</span>
            </div>
            <div class="alternate-phone-from">
              <label>Building <span>*</span></label>
              <input type="text" name="Name" />
              <span class="validation-error">Building is already exit.</span>
            </div>
            <div class="sex-from">
              <label>Street</label>
              <input type="text" name="Name" />
            </div>
          </div>
          <div class="col-md-6 right-form add-address-form">
            <div class="email-from">
              <label>Flat Number </label>
              <input type="text" name="Name" />
            </div>
            <div class="landmark">
              <label>Nearest Landmark</label>
              <input type="text" name="Name" />
            </div>
            <div class="dob">
              <label>City <span>*</span></label>
              <input type="text" name="Name" />
              <span class="validation-error">Building is already exit.</span>
            </div>
            <div class="customer-group">
              <label>Country <span>*</span></label>
              <select class="selectpicker">
                <option>Select Country</option>
                <option>X</option>
                <option>Y</option>
              </select>
              <span class="validation-error">Building is already exit.</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              <span>X</span> Cancel
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save"
              type="button"
              id="save_address"
            >
              Save Address
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>

  <!--End Address popup-->
</template>

<script>
export default {
  name: 'CustomerAddress',
  props: {},
}
</script>
