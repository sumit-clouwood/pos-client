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
        <div
          class="referral-bottom-arrow food-arrow"
          v-show="showScrollDown"
          @click="scroll('up')"
        >
          <i class="fa fa-chevron-down" aria-hidden="true"></i>
        </div>

        <div class="modal-body row">
          <!--<p v-if="errors !== ''" class="errors text-danger">{{ errors }}</p>-->
          <!--<p v-if="msg" class="text-info">{{ msg }}</p>-->
          <div class="error mx-auto" v-show="!referrals">
            <p class="text-danger text-center">
              <span> {{ _t('Referrals are not available.') }}</span>
            </p>
          </div>
          <div class="refferals-wrapper">
            <div v-show="referrals" class="referrals" ref="referralsContainer">
              <div
                class="option-contain"
                ref="entityReferral"
                :class="{
                  active: referral._id === changedReferral.referralId,
                  'color-dashboard-background': true,
                }"
                v-for="referral in referrals"
                :key="referral._id"
                @click="
                  selectedReferral({
                    referralName: referral.name,
                    referralId: referral._id,
                  })
                "
              >
                <p
                  class="reftitle color-text-invert text-uppercase"
                  v-if="referral.referral_type === 'cod'"
                >
                  {{ referral.referral_type }}
                </p>
                <p class="reftitle color-text-invert text-capitalize" v-else>
                  {{ referral.referral_type }}
                </p>
                <h6 class="more color-text">{{ referral.name }}</h6>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer discount-footer">
          <div
            class="refferal-top-arrow food-arrow"
            @click="scroll('down')"
            v-show="showScrollUp"
          >
            <i class="fa fa-chevron-up" aria-hidden="true"></i>
          </div>

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
import { mapGetters } from 'vuex'
import Scroll from '@/mixins/Scroll'
import { bus } from '@/eventBus'

export default {
  name: 'Referrals',
  props: {},
  mounted() {
    bus.$on('open-referrals-popup', () => {
      this.$nextTick(() => {
        setTimeout(() => {
          this.calculateScrolls().catch(() => {})
        }, 300)
      })
    })
  },
  data() {
    return {
      changedReferral: { referralName: 'Referral' },
      container: 'referralsContainer',
      entity: 'entityReferral',
      margin: 100,
      keepEntitiesInScroll: 0,
      scrollcalc: false,
    }
  },
  mixins: [Scroll],
  computed: {
    ...mapGetters('location', ['_t', 'referrals']),
    ...mapGetters('customer', ['isAddressSelected']),
  },
  methods: {
    selectedReferral(referral) {
      this.changedReferral = referral
      this.$store.commit('order/SET_REFERRAL', this.changedReferral)
    },
  },
  watch: {},
}
</script>
<style lang="sass" scoped>
.refferals-wrapper
  max-height: 20rem;
  overflow: hidden;
  width: 100%;
  scroll-behavior: smooth;

  .referrals
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1.25rem;

    .option-contain
      cursor: pointer;
      text-align: left;
      padding: 0.6rem;

      .reftitle
        border-radius: 3px;
        background-color: #f99c32;
        display: inline-block;
        padding: 0.1875rem 0.5rem;
        margin-bottom: 0.3125rem;
        color: #ffffff;
        font-size: 0.875rem;
        font-weight: 700;
        letter-spacing: 0.5px;

.error
  width: 100%

#select-referral
  z-index: 9999


.modal-dialog
    max-width: 40%

.food-arrow
  right: 10px;

.referral-bottom-arrow
  top: 58px;

.refferal-top-arrow
  &.food-arrow
    right: 10px;
    bottom: 84px;
</style>
