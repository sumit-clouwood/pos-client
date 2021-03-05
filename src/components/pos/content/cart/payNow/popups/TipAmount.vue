<template>
  <!-- Tip amount -->
  <div class="modal fade" id="tip-amount" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div
        class="modal-content color-dashboard-background  modal-content-wrapper"
      >
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h4 class="customer-title color-text-invert">
            {{ _t('Tip') + ' ' + _t('Amount') }}
          </h4>
        </div>
        <div class="modal-body tip-amount  modal-body-wrapper">
          <div class="tip-amount-wrap">
            <p class="color-text-invert">{{ _t('Enter Tip Amount') }}</p>
            <input
              v-model="tip"
              type="number"
              name="tip"
              min="0"
              value="0"
              @keydown="isNumberKey($event)"
            />
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              class="btn btn-success btn-large color-main"
              type="button"
              data-dismiss="modal"
              @click="addTip"
            >
              {{ _t('Add') }}
            </button>
            <button
              type="button"
              class="btn btn-danger cancel-announce color-button"
              data-dismiss="modal"
            >
              {{ _t('Cancel') }}
            </button>
          </div>
        </div>
      </div>
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
      if (this.tip < 0) {
        this.tip = 0
      }
      this.$store.commit('checkoutForm/addTip', this.tip)
      this.tip = 0
    },
    isNumberKey(evt) {
      var charCode = evt.which ? evt.which : evt.keyCode
      // eslint-disable-next-line no-console
      console.log(charCode, evt, 'event')
      if (
        charCode == 109 ||
        charCode == 69 ||
        charCode == 189 ||
        evt.which == 45
      ) {
        evt.preventDefault()
      }
      if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false
      }
      // if (charCode == 109) {
      //   return false
      // }
      return true
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
        height: auto;
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
