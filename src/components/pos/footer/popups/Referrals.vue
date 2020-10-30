<template>
  <!-- Select Referrals  -->
  <div class="modal fade" id="select-referral" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal content-->
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
          <h5 class="customer-title color-text-invert">
            {{ _t('Select Referral') }}
          </h5>
        </div>
        <div class="modal-body row dining-options-block select-discount">
          <!--<p v-if="errors !== ''" class="errors text-danger">{{ errors }}</p>-->
          <!--<p v-if="msg" class="text-info">{{ msg }}</p>-->
          <div class="error mx-auto" v-if="!getReferrals">
            <p class="text-danger text-center">
              <span> {{ _t('Referrals are not available.') }}</span>
            </p>
          </div>
          <div v-else class="dining-option-block select-discount-option">
            <div
              class="option-contain"
              :class="{
                active: referral._id === changedReferral.referralId,
                'color-dashboard-background': true,
              }"
              v-for="referral in getReferrals"
              :key="referral._id"
              @click="
                selectedReferral({
                  referralName: referral.name,
                  referralId: referral._id,
                })
              "
            >
              <p
                class="color-text-invert text-uppercase"
                v-if="referral.referral_type === 'cod'"
              >
                {{ referral.referral_type }}
              </p>
              <p class="color-text-invert text-capitalize" v-else>
                {{ referral.referral_type }}
              </p>
              <h6 class="more color-text">{{ referral.name }}</h6>
            </div>
          </div>
        </div>
        <div class="modal-footer discount-footer">
          <div class="btn-announce">
            <button
              class="btn btn-danger btn-large color-text-invert color-button"
              type="button"
              data-dismiss="modal"
            >
              {{ _t('Close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End Select Referrals -->
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Referrals',
  props: {},
  data() {
    return {
      changedReferral: { referralName: 'Referral' },
    }
  },
  computed: {
    ...mapState({
      getReferrals: state => state.location.referrals,
    }),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    selectedReferral(referral) {
      this.changedReferral = referral
      this.$store.commit('order/SET_REFERRAL', this.changedReferral)
    },
  },
}
</script>
<style lang="sass" scoped>
.error
  width: 100%

#select-referral
  z-index: 9999

.modal-dialog
    max-width: 40%
</style>
