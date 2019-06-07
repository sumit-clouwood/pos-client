<template>
  <div class="POSItemOption" v-if="subgroup">
    <div class="POSItemOptions_type">
      <h3 class="POSItemOptions_typehead">
        <span>{{ subgroup.name }} ({{ subgroup.item_type }}) </span>
      </h3>
      <span class="POSItemOptions_typeline"></span>
    </div>
    <div class="POSItemOptions_choose POSItemOptions_choose_radio">
      <div
        v-for="modifier in subgroup.modifiers"
        :key="modifier._id"
        class="POSItemOptions_choose_choice"
      >
        <label
          class="POSItemOptions_choose_label"
          v-if="subgroup.no_of_selection > 1"
        >
          <span class="customradioc">
            <input
              ref="modifier"
              type="checkbox"
              :name="modifier._id"
              :id="modifier._id"
              class="customradio"
              :value="{
                type: 'checkbox',
                itemId: item._id,
                modifierId: modifier._id,
                groupId: subgroup._id,
                limit: subgroup.no_of_selection,
              }"
              v-model="checkboxes"
            />
            <span></span>
          </span>
          <img :src="modifier.item_modifier_image" alt="" />
          <span>{{ modifier.name }}</span>
          <div v-if="Num.toPrice(modifier.value)">
            ({{ formatPrice(modifier.value) }})
          </div>
        </label>

        <label class="container-radio-btn" v-else>
          <span class="customradioc-block">
            <input
              type="radio"
              class="customradio"
              :id="modifier._id"
              :name="subgroup._id"
              :value="modifier._id"
              @click="setRadio(item._id, subgroup._id, modifier._id)"
            />
            <span
              class="checkmark-radio-btn"
              :class="{
                checked: isSelected({
                  modifierId: modifier._id,
                  groupId: subgroup._id,
                  itemId: item._id,
                }),
              }"
            ></span>
          </span>
          <img :src="modifier.item_modifier_image" alt="" />
          <span>{{ modifier.name }}</span>
          <div v-if="Num.toPrice(modifier.value)">
            ({{ formatPrice(modifier.value) }})
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Modifiers',
  props: {
    subgroup: Object,
  },
  data() {
    return {
      itemId: null,
    }
  },
  computed: {
    checkboxes: {
      get() {
        return this.$store.state.orderForm.checkboxes
      },
      set(vmodel) {
        this.$store.commit('orderForm/setCheckboxes', vmodel)
      },
    },
    ...mapState('location', ['currency']),
    ...mapState('modifier', ['item']),
    ...mapState('orderForm', ['error', 'radios']),
    ...mapGetters('orderForm', ['isSelected']),
    ...mapGetters('modifier', ['itemModifiers']),
    ...mapGetters('location', ['formatPrice']),
  },
  mounted() {},
  methods: {
    setRadio(itemId, groupId, modifierId) {
      this.$store.commit('orderForm/setRadios', {
        itemId: itemId,
        groupId: groupId,
        modifierId: modifierId,
      })
      this.$store.commit('orderForm/setError', false)
    },
  },
}
</script>

<style lang="sass" scoped>
/*.checkmark-radio-btn
  &.checked
    background-color: #62bb31
    border-color: #62bb31
    &:after
      display: block
      content: ''
      position: absolute
      top: 3px
      left: 3px
      width: 5px
      height: 5px
      border-radius: 50%
      background: white*/
/*.error*/
/*  color: #ff0000*/
/*  margin-bottom: 24px*/
/*  padding-bottom: 24px*/
/*  border-bottom: 1px solid #e3e7f2*/
/*label*/
/*  img*/
/*    width: 40px*/
/*    height: 40px*/
/*.POSItemOptions_typeline*/
/*  border: 1px solid #e3e7f2*/
</style>
