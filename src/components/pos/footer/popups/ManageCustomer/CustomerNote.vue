<template>
  <!-- customer note popup -->

  <div class="modal fade" id="admin-popup" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title">{{ _t("Customer Note") }}</h4>
        </div>
        <div class="modal-body add-note-wrap">
          <div class="add-note-area">
            <p>{{ _t("Customer Note") }}</p>
            <textarea type="text" class="add-note-form" v-model="note">
            </textarea>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              {{ _t("Cancel") }}
            </button>
            <button
              class="btn btn-success btn-large popup-btn-save"
              type="button"
              data-dismiss="modal"
              id=""
              @click="addNote(note)"
            >
              {{ _t("+ Add") }}
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
import { mapActions, mapGetters } from "vuex";

export default {
  name: "CustomerNote",
  // props: ['note'],
  data() {
    return {
      note: ""
    };
  },
  computed: {
    ...mapGetters("location", ["_t"])
  },
  methods: {
    ...mapActions("customer", ["addNote"])
  }
};
</script>
