<template>
  <div class="back" @click="back">
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.9994 5.92808C17.9675 5.63261 17.7222 5.41163 17.4345 5.4175H1.9168L6.26183 0.99052C6.3713 0.884219 6.43442 0.736065 6.43602 0.581207C6.43841 0.34683 6.30258 0.134245 6.09244 0.0438411C5.8823 -0.0457206 5.6402 0.00450182 5.48038 0.171068L0.166196 5.58244V5.58328C0.0599268 5.69125 0 5.83857 0 5.99259C0 6.14661 0.0599268 6.29391 0.166196 6.4019L5.48038 11.8133C5.58426 11.9296 5.72969 11.9974 5.88228 11.9999C6.03489 12.0024 6.18272 11.9405 6.28979 11.8275C6.39685 11.7153 6.45518 11.5622 6.44959 11.4048C6.444 11.2474 6.37608 11.0993 6.26182 10.9946L1.91679 6.56767H17.4345C17.5847 6.56934 17.7301 6.50908 17.8364 6.39943C17.9427 6.28977 18.001 6.13996 17.9994 5.9851C18.0002 5.96585 18.0002 5.94743 17.9994 5.92818L17.9994 5.92808Z"
        fill="#4B4E53"
      />
    </svg>
    Back
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
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/pixels_rem.scss';
@import '../../../assets/scss/variables.scss';
@import '../../../assets/scss/mixins.scss';

.back {
  width: 100%;
  height: 65px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: none;
  align-items: center;
  @include responsive(mobile) {
    display: flex;
  }

  svg {
    width: 65px;
    margin-right: 20px;
  }
}
</style>
