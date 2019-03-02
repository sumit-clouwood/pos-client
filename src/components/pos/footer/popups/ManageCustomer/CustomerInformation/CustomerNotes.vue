<template>
  <div class="modal fade green-header-modal" id="show-more-notes" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header green-header">
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-hidden="true"
          >
            ×
          </button>
          <h3 id="myModalLabel">CUSTOMER NOTES</h3>
        </div>
        <div class="modal-body add-note-wrap">
          <div
            class="hero-unit noNotes text-center hidden"
            v-if="!customerNotes"
          >
            <h3>No notes yet.</h3>
          </div>
          <div
            class="table-responsive"
            id="notes_data_all"
            v-if="customerNotes"
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
          <button
            class="btn btn-default"
            id="cancel_button"
            data-dismiss="modal"
            aria-hidden="true"
          >
            Close
          </button>
          <button
                  id="customer-notes-add"
                  data-toggle="modal"
                  data-target="#admin-popup"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

function getCustomerList(state) {
  return state.customer.customer.customer_list
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
}
</script>
