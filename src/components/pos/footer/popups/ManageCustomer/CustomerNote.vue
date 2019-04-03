<template>
  <!-- customer note popup -->

  <div class="modal fade green-header-modal" id="admin-popup" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header green-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Customer Notes</h4>
        </div>
        <div class="modal-body add-note-wrap">
          <div class="add-note-area">
            <p>Add Customer Note</p>
            <textarea type="text" class="add-note-form" v-model="note">
            </textarea>
          </div>
        </div>
        <div class="modal-footer">
          <div class="text-left">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              <span>X</span> Cancel
            </button>
            <button
              class="btn btn-success btn-large"
              type="button"
              data-dismiss="modal"
              id=""
              @click="addNote(note)"
            >
              Save
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>

  <!-- customer note popup -->
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CustomerNote',
  // props: ['note'],
  data() {
    return {
      note:''
    }
  },
  methods: {
    ...mapActions('customer', ['addNote']),
  },
}
</script>
