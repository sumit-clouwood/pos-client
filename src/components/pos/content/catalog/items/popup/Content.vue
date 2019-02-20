<template>
  <div class="modal-body" v-if="item">
    <div class="error" v-if="errorBit">{{ errorBit }}</div>
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
            <span>{{ t(submodifier.item_name).name }}</span>
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
                  for="check1"
                  class="customradio"
                  v-model="modifierIds"
                  :value="modifierOption._id"
                  @change="
                    selectItemModifiers({
                      modifier: modifierOption,
                      itemId: item._id,
                    })
                  "
                />
                <span></span>
              </span>
              <img :src="imagePath(modifierOption.imageName)" alt="" />
              <span>{{ t(modifierOption.item_name).name }}</span>
              <div>({{ currency }} {{ modifierOption.price }})</div>
            </label>

            <label class="container-radio-btn" v-else>
              <span class="customradioc-block">
                <input
                  type="radio"
                  for="check1"
                  class="customradio"
                  v-model="pickedOptions"
                  :value="modifierOption._id"
                  name="pasta"
                />
                <span class="checkmark-radio-btn"></span>
              </span>
              <img :src="imagePath(modifierOption.imageName)" alt="" />
              <span>{{ t(modifierOption.item_name).name }}</span>
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
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'Content',
  props: {},
  computed: {
    ...mapState('location', ['currency']),
    ...mapState('modifier', ['item']),
    ...mapState('order', ['errorBit']),
    ...mapGetters('modifier', ['imagePath', 'itemModifiers']),
    ...mapGetters('location', ['rawPrice', 'formatPrice']),
    modifierIds: {
      get() {
        return this.$store.state.order.selectedModifierIds
      },
      set(modifierId) {
        this.$store.commit('order/SELECT_MODIFIER_ID', modifierId)
      },
    },
    pickedOptions: {
      get() {
        return this.$store.state.order.selectedModifierOptions
      },
      set(modifierId) {
        this.$store.commit('order/SELECT_MODIFIER_OPTIONS', modifierId)
      },
    },
  },
  methods: {
    ...mapActions('order', ['selectItemModifiers']),
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
</style>
