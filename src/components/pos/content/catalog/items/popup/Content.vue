<template>
  <div>
    <div
      class="modifier-top-arrow food-arrow"
      @click="scroll('down')"
      v-show="showScrollUp"
    >
      <i class="fa fa-chevron-up" aria-hidden="true"></i>
    </div>
    <div
      class="modifier-bottom-arrow food-arrow"
      v-show="showScrollDown"
      @click="scroll('up')"
    >
      <i class="fa fa-chevron-down" aria-hidden="true"></i>
    </div>
    <div
      class="modal-body color-dashboard-background positemoption_body"
      v-if="getItemModifiers"
    >
      <div class="positemoption-wrapper" ref="modifiersContianer">
        <Modifiers
          v-for="subgroup in getItemModifiers"
          :subgroup="subgroup"
          :key="subgroup._id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Modifiers from './content/Modifiers'
import Scroll from '@/mixins/Scroll'

export default {
  name: 'Content',
  props: {},
  data() {
    return {
      container: 'modifiersContianer',
      entity: 'entityModifier',
      margin: 40,
      keepEntitiesInScroll: 0,
    }
  },
  components: {
    Modifiers,
  },
  mixins: [Scroll],

  computed: {
    ...mapState('modifier', ['item']),
    ...mapGetters('modifier', ['itemModifiers']),
    getItemModifiers() {
      return this.itemModifiers(this.item._id)
    },
  },
  watch: {
    getItemModifiers() {
      this.$nextTick(() => {
        setTimeout(() => {
          //wait for modifiers to load
          this.calculateScrolls().catch(() => {})
        }, 300)
      })
    },
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/header';
@import '@/assets/scss/mixins.scss';
.error {
  color: #ff0000;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e3e7f2;
}
.positemoption_body::-webkit-scrollbar {
  width: 0;
}
.positemoption_body {
  scroll-behavior: smooth;
}

@include responsive(mobile) {
  .modal-body {
    min-height: 0 !important;
    max-height: 15.65rem !important;
  }
}
</style>
<style lang="sass" scoped>
.positemoption_body
  scroll-behavior: smooth
</style>
