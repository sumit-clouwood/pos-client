<template>
  <div class="modal fade blur-background" id="show-more-notes" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Customer Notes</h4>
        </div>
        <div class="modal-body form-block ">
          <div
            class="hero-unit noNotes text-center hidden"
            v-if="customerNotes.length == 0"
          >
            <h3>No notes yet.</h3>
          </div>
          <div
            class="table-responsive"
            id="notes_data_all"
            v-if="customerNotes.length > 0"
          >
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Note</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody id="notes_data">
                <tr v-for="notes in customerNotes" :key="notes._id">
                  <td>{{ notes.created_at }}</td>
                  <td>{{ notes.message }}</td>
                  <td>{{ notes.user_name.name }}</td>
                </tr>
              </tbody>
            </table>
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
              data-toggle="modal"
              @click="hideModal()"
              data-target="#admin-popup"
            >
              + Add Note
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapState } from 'vuex'

function getCustomerList(state) {
  return state.customer.customer ? state.customer.customer.customer_list : false
}

export default {
  name: 'CustomerNotes',
  computed: {
    ...mapState({
      customerNotes: state =>
        getCustomerList(state) && getCustomerList(state).customer_notes
          ? getCustomerList(state).customer_notes
          : false,
    }),
  },
  methods: {
    hideModal: function() {
      $('#show-more-notes').modal('toggle')
    },
  },
}
</script>
