<template>
  <div
    class="modal fade"
    id="pos-waiting-time"
    tabindex="-1"
    role="dialog"
    aria-labelledby="posWaitingTIme"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ _t('Set POS waiting time') }}
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <!--<div class="modal-body" v-if="loader">
          <Preloader />
        </div>-->
        <div class="modal-body">
          <div class="upper">
            <div class="autocomplete-container">
              <form class="modifyperms-container">
                <div class="modifyperms-container">
                  <div class="">
                    {{ _t('Enter waiting time in hh:mm format') }}
                  </div>
                  <div>
                    <input
                      autocomplete="off"
                      type="text"
                      placeholder="00:00"
                      class="form-control"
                      v-model="pos_waiting_time"
                    />
                  </div>
                  <!--<p v-if="passwordVerification" class="text-danger">
                    {{ passwordVerification }}
                  </p>-->
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-announce">
            <button
              type="button"
              class="btn btn-success"
              data-dismiss="modal"
              @click="updateWaitingTime()"
            >
              {{ _t('Submit') }}
            </button>
            <button type="button" class="btn btn-danger" data-dismiss="modal">
              {{ _t('Close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// /* global showModal hideModal */
// import Preloader from '@/components/util/Preloader'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'POSWaitingTime',
  components: {
    // Preloader,
  },
  computed: {
    requiredSupervisor() {
      return (
        this.$store.state.location.brand &&
        this.$store.state.location.brand.mandatory_password === true
      )
    },
    ...mapGetters('location', ['_t']),
    ...mapState('location', ['store']),
    ...mapState('reports', ['passwordVerification', 'loader', 'modalView']),
    pos_waiting_time: {
      get() {
        return this.store ? this.store.waiting_time || '00:00' : '00:00'
      },
      set(value) {
        this.$store.commit('location/SET_POS_WAITING_TIME', {
          waiting_time: value,
        })
      },
    },
  },
  methods: {
    updateWaitingTime() {
      this.$store.dispatch('order/updatePOSWaitingTime')
    },
    /*setPassword() {
      /!*this.$store.dispatch(
        'reports/setSupervisorPassword',
        this.supervisorPassword,
        {
          root: true,
        }
      )*!/
      /!*this.$store.dispatch('reports/businessSummary').then(() => {
        if (this.modalView === '#business-summary') {
          showModal(this.modalView)
          hideModal('#supervisor-password')
        }
      })*!/
      this.supervisorPassword = ''
    },*/
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

#supervisor-password {
  .modal-dialog {
    .modal-content {
      .modal-header {
        height: 80px;
        background-color: #fff;
      }
      .modifyperms-container {
        padding-bottom: 10px;
      }
    }
  }
}

@include responsive(mobile) {
  #supervisor-password {
    position: fixed !important;
    .modal-dialog {
      .modal-content {
        .modal-header {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: none;
        }
        .modal-footer {
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}
</style>
