<template>
  <div class="online-counter">
    <span class="online-counter-text">{{ _t('Online') }}</span>
    <span class="online-counter-num">2</span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';
.online-counter {
  display: grid;
  grid-template-columns: max-content max-content;
  align-items: center;
  .online-counter-text {
    font-size: 0.8rem;
    margin-right: 10px;
    @include responsive(mobile) {
      margin-right: 0.3rem !important;
      font-size: 0.7rem;
    }
  }
  .online-counter-num {
    width: 25px;
    height: 25px;
    background-color: #64c434;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 600;
    @include responsive(mobile) {
      font-size: 0.7rem;
    }
  }
}
</style>
