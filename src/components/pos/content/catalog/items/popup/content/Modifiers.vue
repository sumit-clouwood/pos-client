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
                    limit: 4 || submodifier.noofselection,
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
                  :key="modifierOption._id"
                  :id="modifierOption._id"
                  :name="submodifier._id"
                  :value="{
                    type: 'radio',
                    itemId: item._id,
                    modifierId: modifierOption._id,
                    groupId: submodifier._id,
                  }"
                  @change="
                    setRadio(item._id, submodifier._id, modifierOption._id)
                  "
                  v-model="radios[submodifier._id]"
                />
                <span class="checkmark-radio-btn"></span>
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
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Modifiers',
  data() {
    return {
      radios: this.$store.state.orderForm.radios,
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
    ...mapState('orderForm', ['error']),
    ...mapGetters('modifier', ['imagePath', 'itemModifiers']),
    ...mapGetters('location', ['rawPrice', 'formatPrice']),
  },
  methods: {
    setRadio(itemId, groupId, modifierId) {
      //bind model here yourself, it’s possible to add reactive properties to a nested object
      this.$set(this.radios, groupId, {
        type: 'radio',
        itemId: itemId,
        modifierId: modifierId,
        groupId: groupId,
      })

      this.$store.commit('orderForm/setRadios', this.radios)
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
</style>
