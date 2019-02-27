<template>
  <!-- Add Note -->
  <div class="modal fade" id="add-note" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header customer-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">Add note</h4>
        </div>
        <div class="modal-body add-note-wrap">
          <div class="add-note-area">
            <p>Enter Order Note</p>
            <textarea type="text" class="add-note-form"> </textarea>
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
              class="btn btn-success btn-large"
              type="button"
              id="save-note"
            >
              Save
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>

  <!-- Add note -->
  <!-- ====================================== -->
</template>

<script>
export default {
  name: 'AddNote',
  props: {}
};
</script>
