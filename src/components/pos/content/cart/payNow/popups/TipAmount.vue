<template>
  <!-- Tip amount -->
  <div class="modal fade" id="tip-amount" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div
        class="modal-content color-dashboard-background  modal-content-wrapper"
      >
        <div class="modal-body tip-amount  modal-body-wrapper">
          <div class="tip-amount-wrap">
            <p class="color-text-invert">{{ _t('Enter Tip Amount') }}</p>
            <input
              v-model.number="tip"
              type="number"
              name="tip"
              min="0"
              value="0"
              @keypress="Num.toNumberOnly($event)"
            />
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
            <button
              class="btn btn-success btn-large color-main"
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
    <div class="modal-footer">
      <div class="btn-announce">
        <button
          type="button"
          class="btn btn-danger cancel-announce color-button"
          data-dismiss="modal"
        >
          {{ _t('Cancel') }}
        </button>
        <button
          class="btn btn-success btn-large color-main"
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
  <!-- End Tip Amount -->
</template>

<script>
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
      this.tip = 0
    },
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #tip-amount {
    transform: none;
    animation: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100vh;

    .modal-dialog {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: 100vh;
      display: grid;

      .modal-content {
        height: 100%;
        display: grid;
        grid-template-rows: 1fr max-content;
        background-color: transparent;
        .modal-body {
          background-color: #fff;
        }
        .modal-footer {
          background-color: #fff;
        }
      }
    }
    .modal-footer-btn-wrapper {
      margin-bottom: 0px !important;
    }
    .modal-content-wrapper {
      height: fit-content;
    }
    .modal-body-wrapper {
      min-height: 0 !important;
    }
  }
}
</style>
