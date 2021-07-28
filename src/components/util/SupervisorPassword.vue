<template>
  <div
    class="modal fade"
    id="supervisor-password"
    tabindex="-1"
    role="dialog"
    aria-labelledby="SupervisorPassword"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalOrderModificationTitle">
            {{ _t('Please enter supervisor password') }}
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
        <div class="modal-body" v-if="loader">
          <Preloader />
        </div>
        <div v-else class="modal-body">
          <div class="upper">
            <div class="autocomplete-container">
              <form class="modifyperms-container">
                <div class="modifyperms-container" v-if="requiredSupervisor">
                  <div class="select-driver">
                    {{ _t('Supervisor Password') }}
                  </div>
                  <div>
                    <input
                      autocomplete="off"
                      type="password"
                      class="input-search-driver"
                      v-model="supervisorPassword"
                    />
                  </div>
                  <p v-if="passwordVerification" class="text-danger">
                    {{ passwordVerification }}
                  </p>
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
              @click="setPassword()"
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
/* global showModal hideModal */
import Preloader from '@/components/util/Preloader'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'SupervisorPassword',
  data() {
    return {
      supervisorPassword: '',
    }
  },
  components: {
    Preloader,
  },
  computed: {
    requiredSupervisor() {
      return (
        this.$store.state.location.brand &&
        this.$store.state.location.brand.mandatory_password === true
      )
    },
    ...mapGetters('location', ['_t']),
    ...mapGetters('context', ['store']),
    ...mapState('reports', ['passwordVerification', 'loader', 'modalView']),
  },
  methods: {
    setPassword() {
      if (this.supervisorPassword.length < 1) {
        this.$store.commit(
          'reports/PASSWORD_VERIFICATION',
          'Please enter password'
        )
        return false
      }
      this.$store.dispatch(
        'reports/setSupervisorPassword',
        this.supervisorPassword,
        {
          root: true,
        }
      )
      this.$store.dispatch('reports/businessSummary').then(() => {
        if (this.modalView === '#business-summary') {
          showModal(this.modalView)
          hideModal('#supervisor-password')
        }
      })
      this.supervisorPassword = ''
    },
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
