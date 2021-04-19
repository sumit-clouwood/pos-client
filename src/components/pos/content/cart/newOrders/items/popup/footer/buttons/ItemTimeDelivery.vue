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
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'BtnItemDeliveryTime',
  props: {},
  data() {
    return {
      timerStart: 10,
      timerEnd: 100,
      itemDeliveryTime: 0,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
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
      this.$store.dispatch('order/addItemDeliveryTime', time)
    },
  },
  mounted() {
    this.itemDeliveryTime = 0
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
