<template>
  <div>
    <div class="modifier-top-arrow food-arrow disable" @click="modifierTop">
      <i class="fa fa-chevron-up" aria-hidden="true"></i>
    </div>
    <div
      class="modifier-bottom-arrow food-arrow disable"
      @click="modifierBottom"
    >
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
    this.modifierScroll()
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
      if (this.modifierBlockHeight === this.modifierBlockInitHeight) {
        $('.modifier-top-arrow').addClass('disable')
      }
    },
    modifierBottom() {
      if (this.modifierBlockHeight >= this.modifierBlockItemHeight) {
        $('.modifier-bottom-arrow').addClass('disable')
        this.modifierBlockHeight = parseInt(this.modifierBlockItemHeight)
        return false
      } else {
        $('.modifier-top-arrow').removeClass('disable')
        if (
          this.modifierBlockHeight == this.modifierBlockInitHeight ||
          this.modifierBlockHeight === 0
        ) {
          this.modifierBlockHeight += parseInt(
            this.modifierBlockInitHeight - 100
          )
        } else {
          this.modifierBlockHeight += parseInt(this.modifierBlockInitHeight)
        }
      }

      $('.positemoption_body').animate(
        { scrollTop: this.modifierBlockHeight },
        1000
      )

      if (this.modifierBlockHeight >= this.modifierBlockItemHeight) {
        $('.modifier-bottom-arrow').addClass('disable')
        this.modifierBlockHeight = parseInt(this.modifierBlockItemHeight)
      }
    },
    modifierTop() {
      if (this.modifierBlockHeight <= 0) {
        this.modifierBlockHeight = parseInt(this.modifierBlockInitHeight)
        $('.modifier-top-arrow').addClass('disable')
        return false
      } else {
        $('.modifier-bottom-arrow').removeClass('disable')
        if (this.modifierBlockHeight === this.modifierBlockItemHeight) {
          this.modifierBlockHeight -= parseInt(
            this.modifierBlockInitHeight + 100
          )
        } else {
          this.modifierBlockHeight -= parseInt(this.modifierBlockInitHeight)
        }
      }
      $('.positemoption_body').animate(
        { scrollTop: this.modifierBlockHeight },
        1000
      )

      if (this.modifierBlockHeight <= 0) {
        this.modifierBlockHeight = parseInt(this.modifierBlockInitHeight)
        $('.modifier-top-arrow').addClass('disable')
      }
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
.positemoption_body::-webkit-scrollbar {
  width: 0;
}
</style>
