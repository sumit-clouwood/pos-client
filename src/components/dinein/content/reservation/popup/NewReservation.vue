<template>
  <div class="modal fade" id="NewReservation">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Make a reservation</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="exampleInputEmail1">Select Number of guests</label>
                <div
                  id="exampleInputEmail1"
                  class="btn-group btn-group-toggle"
                  data-toggle="buttons"
                >
                  <label v-for="(n, i) in 8" :key="n" class="btn btn-secondary">
                    <input
                      type="radio"
                      name="options"
                      :id="'option' + i"
                      autocomplete="off"
                    />
                    {{ i + 1 }} {{ n === 8 ? '+' : '' }}
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">Select Number of guests</label>
                <div class="row">
                  <div class="col-sm-3"></div>
                </div>
              </div>
            </div>
            <div class="col-md-6">v</div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-success">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewReservation',
}
</script>

<style scoped></style>
