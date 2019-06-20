<template>
  <!-- Tip amount -->
  <div class="modal fade" id="tip-amount" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-body tip-amount">
          <div class="tip-amount-wrap">
            <p>{{ _t('Enter Tip Amount') }}</p>
            <input v-model.number="tip" type="number" name="tip" min="0" />
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
            <button
              class="btn btn-success btn-large"
              type="button"
              data-dismiss="modal"
              id="add-top"
              @click="addTip"
            >
              {{ _t('Add') }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Tip Amount -->
</template>

<script>
/*global $*/
import { mapGetters } from 'vuex'
export default {
  name: 'TipAmount',
  data: function() {
    return {
      tip: 0,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
  methods: {
    addTip() {
      this.$store.commit('checkoutForm/addTip', this.tip)
      $('input[name=tip]').val(0)
    },
  },
}
</script>
