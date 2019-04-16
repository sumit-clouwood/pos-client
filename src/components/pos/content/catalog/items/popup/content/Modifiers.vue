<template>
  <div class="modal-body-modifiers" v-if="item">
    <div
      v-for="modifier in itemModifiers(item._id).modifiers"
      :key="modifier._id"
    >
      <div
        class="POSItemOption"
        v-for="submodifier in modifier.get_modifier_sub_groups"
        :key="submodifier._id"
      >
        <div class="POSItemOptions_type">
          <h3 class="POSItemOptions_typehead">
            <span>{{ submodifier.name }} ({{ submodifier.type }}) </span>
          </h3>
          <span class="POSItemOptions_typeline"></span>
        </div>
        <div class="POSItemOptions_choose POSItemOptions_choose_radio">
          <div
            class="POSItemOptions_choose_choice"
            v-for="modifierOption in submodifier.get_modifier_item_list"
            :key="modifierOption._id"
          >
            <label
              class="POSItemOptions_choose_label"
              v-if="submodifier.noofselection > 1"
            >
              <span class="customradioc">
                <input
                  type="checkbox"
                  :name="modifierOption._id"
                  :id="modifierOption._id"
                  class="customradio"
                  :value="{
                    type: 'checkbox',
                    itemId: item._id,
                    modifierId: modifierOption._id,
                    groupId: submodifier._id,
                    limit: submodifier.noofselection,
                  }"
                  v-model="checkboxes"
                />
                <span></span>
              </span>
              <img :src="imagePath(modifierOption.imageName)" alt="" />
              <span>{{ modifierOption.name }}</span>
              <div>({{ currency }} {{ modifierOption.price }})</div>
            </label>

            <label class="container-radio-btn" v-else>
              <span class="customradioc-block">
                <input
                  type="radio"
                  class="customradio"
                  :id="modifierOption._id"
                  :name="item._id + submodifier._id"
                  :value="modifierOption._id"
                  @change="
                    setRadio(item._id, submodifier._id, modifierOption._id)
                  "
                />
                <span
                  class="checkmark-radio-btn"
                  :class="{
                    checked: isSelected({
                      modifierId: modifierOption._id,
                      groupId: submodifier._id,
                      itemId: item._id,
                    }),
                  }"
                ></span>
              </span>
              <img :src="imagePath(modifierOption.imageName)" alt="" />
              <span>{{ modifierOption.name }}</span>
              <div v-if="rawPrice(modifierOption.price)">
                ({{ formatPrice(modifierOption.price) }})
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Modifiers',
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
    ...mapGetters('modifier', ['imagePath', 'itemModifiers']),
    ...mapGetters('location', ['rawPrice', 'formatPrice']),
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
.checkmark-radio-btn
  &.checked
    background-color: #62bb31;
    border-color: #62bb31;
    &:after
      display: block;
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: white;
.error
  color: #ff0000;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e3e7f2;
</style>
