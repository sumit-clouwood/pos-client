<template>
  <div>
    <div class="modifier-top-arrow food-arrow" @click="modifierTop">
      <i class="fa fa-chevron-up" aria-hidden="true"></i>
    </div>
    <div class="modifier-bottom-arrow food-arrow" @click="modifierBottom">
      <i class="fa fa-chevron-down" aria-hidden="true"></i>
    </div>
    <div
      class="modal-body color-dashboard-background positemoption_body"
      v-if="itemModifiers(item._id)"
    >
      <div class="positemoption-wrapper">
        <Modifiers
          v-for="subgroup in itemModifiers(item._id)"
          :subgroup="subgroup"
          :key="subgroup._id"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapState } from 'vuex'
import Modifiers from './content/Modifiers'
export default {
  name: 'Content',
  props: {},
  data() {
    return {
      modifierBlockHeight: 0,
      modifierBlockInitHeight: 0,
      modifierBlockItemHeight: 0,
    }
  },
  components: {
    Modifiers,
  },
  computed: {
    ...mapState('modifier', ['item']),
    ...mapGetters('modifier', ['itemModifiers']),
  },
  mounted() {
    this.modifier()
  },
  methods: {
    modifierScroll() {
      let modifierBlockHeight = $('.positemoption_body').innerHeight()
      this.modifierBlockHeight = modifierBlockHeight
      this.modifierBlockInitHeight = modifierBlockHeight
      this.modifierBlockItemHeight = $('.positemoption-wrapper').innerHeight()
      $('.modifier-bottom-arrow, .modifier-top-arrow').removeClass('disable')
      if (this.modifierBlockHeight > this.modifierBlockItemHeight) {
        $('.modifier-bottom-arrow, .modifier-top-arrow').addClass('disable')
      }
    },
    modifierBottom() {
      if (this.modifierBlockItemHeight === 0) this.modifierScroll()
      if (this.modifierBlockHeight >= this.modifierBlockItemHeight) {
        this.modifierBlockHeight -= parseInt(this.modifierBlockInitHeight)
        $('.modifier-bottom-arrow').addClass('disable')
        return false
      }
      $('.modifier-top-arrow').removeClass('disable')
      $('.positemoption_body').animate(
        { scrollTop: this.modifierBlockHeight },
        1000
      )
      this.modifierBlockHeight += parseInt(this.modifierBlockInitHeight)
    },
    modifierTop() {
      if (this.modifierBlockItemHeight === 0) this.modifierScroll()
      if (this.modifierBlockHeight <= 0) {
        this.modifierBlockHeight += parseInt(this.modifierBlockInitHeight)
        $('.modifier-top-arrow').addClass('disable')
        return false
      }
      this.modifierBlockHeight -= parseInt(this.modifierBlockInitHeight)
      $('.modifier-bottom-arrow').removeClass('disable')
      $('.positemoption_body').animate(
        { scrollTop: this.modifierBlockHeight },
        1000
      )
    },
  },
}
</script>

<style scoped>
.error {
  color: #ff0000;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e3e7f2;
}
.modifier-bottom-arrow.food-arrow {
  bottom: 0;
}
.positemoption_body::-webkit-scrollbar {
  width: 0;
}
</style>
