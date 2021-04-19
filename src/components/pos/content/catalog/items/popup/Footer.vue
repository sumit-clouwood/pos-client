<template>
  <div class="modal-footer color-dashboard-background">
    <p class="text-danger" v-if="errorMessage">{{ errorMessage }}</p>
    <div class="btn-announce apply_btn">
      <template>
        <div class="dropdown show">
          <a
            class=""
            href="#"
            role="button"
            id="select-item-time"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {{
              itemDeliveryTime
                ? itemDeliveryTime + _t(' Minutes')
                : _t('Item delivery time')
            }}
          </a>

          <div class="dropdown-menu" aria-labelledby="select-item-time">
            <span class="dropdown-item">
              <span
                @click="setItemDeliveryTime(0)"
                href="javascript:void(0)"
                class="time-s"
              >
                {{ _t('On time') }}
              </span>
            </span>
            <span v-for="i in timer_loop" :key="i" class="dropdown-item">
              <span
                @click="setItemDeliveryTime(i)"
                href="javascript:void(0)"
                class="time-s"
              >
                {{ i }}{{ _t(' Minutes') }}
              </span>
            </span>
          </div>
        </div>
        <button
          type="button"
          data-toggle="modal"
          data-target="#popup-item-note"
          class="buttoned colorwhite discountitembutton"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="pen-square"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            class="svg-inline--fa fa-pen-square fa-w-14 fa-2x"
          >
            <path
              fill="currentColor"
              d="M400 480H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zM238.1 177.9L102.4 313.6l-6.3 57.1c-.8 7.6 5.6 14.1 13.3 13.3l57.1-6.3L302.2 242c2.3-2.3 2.3-6.1 0-8.5L246.7 178c-2.5-2.4-6.3-2.4-8.6-.1zM345 165.1L314.9 135c-9.4-9.4-24.6-9.4-33.9 0l-23.1 23.1c-2.3 2.3-2.3 6.1 0 8.5l55.5 55.5c2.3 2.3 6.1 2.3 8.5 0L345 199c9.3-9.3 9.3-24.5 0-33.9z"
              class
            ></path>
          </svg>
          <span>{{ _t('Add Note') }}</span>
        </button>
      </template>
      <AddModifierOrderButton @error="error" />
      <RemoveFromComboButton
        v-if="current_combo_selected_item"
      ></RemoveFromComboButton>
    </div>
  </div>
</template>

<script>
//this footer ll be always called by the catalog and modifiers items only
import { mapGetters } from 'vuex'

import AddModifierOrderButton from './footer/AddModifierOrderButton'
import RemoveFromComboButton from './footer/RemoveFromComboButton'
export default {
  name: 'Footer',
  props: {},
  data() {
    return {
      errorMessage: false,
      timerStart: 10,
      timerEnd: 100,
      itemDeliveryTime: 0,
    }
  },
  components: {
    AddModifierOrderButton,
    RemoveFromComboButton,
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('combo', ['current_combo_selected_item']),
    combo_item_with_mods() {
      const item = this.$store.getters['combo/current_combo_selected_item']
      if (
        //this.$store.getters['combo/current_order_combo'] &&
        item &&
        this.$store.getters['modifier/hasModifiers'](item)
      ) {
        return true
      }
      return false
    },
    timer_loop() {
      let timer_ = []
      let i = this.timerStart
      for (i; i <= this.timerEnd; i += 10) {
        timer_.push(i)
      }
      return timer_
    },
  },
  methods: {
    setItemDeliveryTime(time) {
      this.itemDeliveryTime = time
      this.$store.commit('orderForm/setItemDeliveryTime', time)
    },
    error(errorMessage) {
      this.errorMessage = errorMessage
    },
  },
  mounted() {
    setTimeout(() => {
      this.errorMessage = false
    }, 3000)
  },
}
</script>
<style scoped type="scss">
.dropdown-item {
  padding: 0.55rem 1.5rem;
}
#select-item-time {
  background: transparent;
  border: none;
  border-bottom: 1px solid #000;
  color: #000;
  padding: 15px 16px 13px;
  line-height: 15px;
}
@media only screen and (min-width: 320px) and (max-width: 576px) {
  #select-item-time {
    width: 100%;
    font-size: 20px;
  }
  .time-s {
    font-size: 20px;
  }
}
/*.dropdown-menu {
  padding: 0.5rem 1.5rem;
}*/
.time-s {
  padding: 0.5rem 1.5rem;
}
</style>
