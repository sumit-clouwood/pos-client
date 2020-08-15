<template>
  <div class="modal-body color-dashboard-background grid_combo_left">
    <div class="food-menu_container" v-if="current_combo">
      <div
        class="food-menu_title"
        v-for="(section, index) in current_combo.combo_items"
        :class="{ active_left_combo: section == current_combo_section }"
        :key="index"
        @click="selectComboSection(section)"
      >
        <p class="food_title">{{ section.name }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Cart from '@/mixins/Cart'

export default {
  data() {
    return {
      currentSection: 0,
    }
  },
  name: 'Items',
  watch: {},
  mixins: [Cart],
  computed: {
    ...mapGetters('combo', [
      'current_combo',
      'current_combo_section',
      'current_combo_selected_items',
    ]),
    ...mapGetters('location', ['_t']),
  },
  methods: {
    selectComboSection(section) {
      const isValid = this.validateSection()
      const sections = this.$store.getters['combo/current_combo'].combo_items
      const newSectionNo = sections.findIndex(sec => sec._id == section._id)
      const previousSectionNo = sections.findIndex(
        sec => sec._id == this.currentSection._id
      )
      if (isValid === true || newSectionNo < previousSectionNo) {
        this.$store.commit('combo/SET_CURRENT_COMBO_SECTION', section)
      }
      if (isValid === false) {
        //validation failed, remove current item
        this.$store.dispatch(
          'combo/setError',
          this._t(
            `You can select ${this.currentSection.qty} item(s) from ${this.currentSection.name}`
          )
        )
      } else {
        if (isValid === true) {
          //ok
          this.$store.dispatch('combo/clearError')
          const sections = this.$store.getters['combo/current_combo']
            .combo_items
          const sectionNo = sections.findIndex(
            section => section._id == this.currentSection._id
          )
          if (sectionNo < sections.length - 1) {
            this.$store.commit(
              'combo/SET_MSG',
              'Awesome! select items from ' +
                this.$store.getters['combo/current_section'].name
            )
          } else {
            this.$store.commit(
              'combo/SET_MSG',
              'Awesome! click on add to order button'
            )
          }
        } else if (isValid > 0) {
          //still need to select more
          this.$store.dispatch(
            'combo/setError',
            this._t(
              `Select ${isValid} more item(s) from ${this.currentSection.name}`
            )
          )
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.modal-body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 1rem;
  .food-menu-item {
    min-width: 95%;
    max-width: 95%;
    min-height: 12rem;
    max-height: 12rem;
    margin: auto;
    border: 2px solid #e3e7f2;
    padding: 0px 4px !important;

    .food-menu-item-img {
      margin: 0 auto;
      border-radius: $px3;
      width: 100%;
      max-height: $px130;
      margin-bottom: auto;
    }
    .food-menu-item-text {
      font-size: 1.1rem;
      text-align: center;
    }
    .food-menu-item-price {
      text-align: center;
      color: crimson;
      font-size: 0.9rem;
      font-weight: 600;
    }
  }
}
.food-menu_container {
  display: grid;
  grid-template-rows: 1fr;
  grid-row-gap: 0.625rem;
  position: relative;
}
.food-menu_title {
  position: relative;
  cursor: pointer;
  height: 4.063rem;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  background-color: #9c9c9c;
  color: white;
  border-radius: 0.25rem;
}
.food-menu_title:hover {
  box-shadow: #666bcfa1 0px 1px 12px;
  transition: all 0.3s ease-in-out;
}
.food-menu_title.active_left_combo {
  background-color: #5056ca;
  /*border-right: 1rem solid red;*/
}
i.fa.fa-check.food-item-checked {
  position: absolute;
  right: 0px;
  top: 0px;
  color: white;
  background: #434343;
  padding: 0.188rem;
  border-radius: 0.188rem;
  font-weight: 300;
}
@media only screen and (max-width: 600px) and (min-width: 320px) {
  .food-menu_title.active_left_combo {
    background-color: #5056ca;
    border-right: none;
  }
  .food-menu_container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;
    // overflow: hidden;
    // overflow-x: auto;
  }
  .modal-body.color-dashboard-background.grid_combo_left {
    height: 80px !important;
    padding: 0px !important;
    align-items: center;
    min-height: unset !important;
    max-height: unset !important;
    margin-bottom: 0.938rem;
  }
  .food-menu_title {
    // margin-right: 0.625rem;
    // width: 4.375rem;
    // max-width: 4.375rem;
    width: 100%;
  }
}
</style>
