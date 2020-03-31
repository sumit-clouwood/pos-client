<template>
  <div class="back" @click="back">
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="30px"
      height="30px"
      viewBox="0 0 306 306"
      style="enable-background:new 0 0 306 306;"
      xml:space="preserve"
    >
      <g>
        <g id="chevron-left">
          <polygon
            points="247.35,35.7 211.65,0 58.65,153 211.65,306 247.35,270.3 130.05,153 		"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['param'],
  name: 'btnBack',
  computed: {
    ...mapGetters(['allCategoryHendler']),
  },
  methods: {
    back() {
      if (this.param === 'category') {
        this.$store.dispatch('backCategory')
      } else if (this.param === 'subcategory') {
        this.$store.dispatch('backSubCategory')
      } else if (this.param === 'item') {
        this.$store.dispatch('backItem')
      } else if (this.param === 'transaction') {
        this.$store.dispatch('transactionList')
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.back {
  /*width: 100%;*/
  height: 65px;
  /*background-color: red;*/
  border-bottom: 1px solid #eee;
  display: none;
  align-items: center;
  @include responsive(mobile) {
    display: flex;
  }

  svg {
    width: 35px;
    /*margin-right: 20px;*/
  }
}
</style>
