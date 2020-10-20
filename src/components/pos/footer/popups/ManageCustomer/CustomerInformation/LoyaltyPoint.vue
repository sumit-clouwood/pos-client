<template>
  <div class="cu-loyality-points-title">
    <p class="color-text-invert">
      {{ _t('Loyalty Points Earned:') }}
      <span data-toggle="tooltip" title="Redeem">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path
            fill="#FFC10E"
            fill-rule="evenodd"
            d="M3.64 8.135h.472a5.326 5.326 0 0 0 3.725 3.004v1.75H6.532a.73.73 0 0 0-.729.729v.957h-.65a.465.465 0 0 0-.472.474v2.486c0 .257.209.465.465.465h7.618a.463.463 0 0 0 .472-.465V15.05a.465.465 0 0 0-.464-.465h-.657v-.956a.729.729 0 0 0-.73-.73h-1.304v-1.76a5.326 5.326 0 0 0 3.725-3.003h.473a3.637 3.637 0 0 0 3.637-3.64v-2.21a.583.583 0 0 0-.583-.584h-3.055V.583A.583.583 0 0 0 13.695 0H4.221a.583.583 0 0 0-.584.583v1.12H.583A.583.583 0 0 0 0 2.286v2.209a3.639 3.639 0 0 0 3.64 3.64zm10.639-2.191v-2.4h1.797v.951a1.8 1.8 0 0 1-1.797 1.796h-.012c.005-.114.012-.231.012-.347zM6.684 4.318l1.313-.194a.23.23 0 0 0 .17-.125l.584-1.188a.227.227 0 0 1 .408 0L9.743 4a.228.228 0 0 0 .17.125l1.313.194a.228.228 0 0 1 .126.389l-.948.926a.229.229 0 0 0-.067.194l.224 1.306a.228.228 0 0 1-.33.24l-1.167-.617a.227.227 0 0 0-.212 0l-1.167.617a.227.227 0 1 1-.33-.24l.223-1.306a.227.227 0 0 0-.066-.195l-.948-.926v.001a.228.228 0 0 1 .12-.389zm-4.84-.777H3.64v2.403c0 .117 0 .233.01.347h-.01a1.8 1.8 0 0 1-1.797-1.797v-.953z"
          />
        </svg>
        {{ loyalty + ' (' + _t('Points') }})
      </span>
    </p>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'LoyaltyPoint',
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapState({
      loyalty: state =>
        state.customer.customerLoyalty.card
          ? state.customer.customerLoyalty.card.balance
          : 0,
    }),
  },
}
</script>
