<template>
  <div class="modal fade" id="switchWaiter" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <h4 class="customer-title color-text-invert">
            {{ _t('Select') + ' ' + _t('Waiter') }}
          </h4>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <div id="available-tables" class="available-tables cursor-pointer">
            <div class="table-status-container">
              <span
                class="table-status"
                style="text-align:center"
                :class="{ active: selectedWaiter._id === waiter._id }"
                v-for="waiter in waiters"
                :key="waiter._id"
                @click="select(waiter)"
              >
                <span v-html="waiter.name"></span>
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main color-text-invert"
              type="button"
              id="discount-save-btn"
              @click="assignWaiter"
            >
              {{ _t('Assign') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  name: 'DineInCoverSelection',
  data() {
    return {
      waiter: null,
      selectedWaiter: {},
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState('auth', ['waiters', 'userDetails']),
  },
  mounted() {
    this.waiter = this.$store.state.dinein.selectedTable
  },
  methods: {
    select: function(waiter) {
      this.selectedWaiter = waiter
    },
    ...mapActions('dinein', ['assignWaiter']),
  },
}
</script>
