<template>
  <div class="date-time">
    <a href="#">
      <span class="time">{{ todayTime }}</span>
      <span class="date"><DateTimeVue /></span>
    </a>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import DateTimeVue from '@/components/util/DateTimeVue'

export default {
  data() {
    return {
      todayDate: moment().format('L'),
      todayTime: moment().format('h:mm:ss a'),
    }
  },
  components: {
    DateTimeVue,
  },
  mounted() {
    setInterval(() => {
      this.todayTime = moment().format('LT')
    }, 1000)
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/mixins.scss';

.date-time {
  grid-column-start: 1;
  grid-column-end: 2;
  @include responsive(mobile) {
    font-size: 0.7rem;
  }
  a {
    color: #4b4e53;
    font-weight: 600;
    letter-spacing: 0.8px;
    font-size: 14px;
    @include responsive(mobile) {
      font-size: 0.7rem;
    }
    .time {
      margin-right: 10px;
      @include responsive(mobile) {
        font-size: 0.7rem;
      }
    }
  }
}
</style>
