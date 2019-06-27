<template>
  <div class="POSItemOption" v-if="subgroup">
    <div class="POSItemOptions_type">
      <h3 class="POSItemOptions_typehead">
        <!--<span>{{ subgroup.name }} ({{ subgroup.item_type }}) </span>-->
        <span>{{ subgroup.name }}</span>
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
          <img
            :src="modifier.item_modifier_image"
            alt=""
            v-if="modifier.item_modifier_image != ''"
          />
          <img
            v-else
            :style="{
              background:
                modifier.item_modifier_image == ''
                  ? modifier.item_modifier_color
                  : '',
            }"
          />
          <span>{{ modifier.name }}</span>
          <div class="itm-price" v-if="Num.toPrice(modifier.value)">
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
          <img
            v-if="modifier.item_modifier_image != ''"
            :src="modifier.item_modifier_image"
            alt=""
          />
          <img
            v-else
            :style="{
              background:
                modifier.item_modifier_image == ''
                  ? modifier.item_modifier_color
                  : '',
            }"
          />
          <span>{{ modifier.name }}</span>
          <div v-if="Num.toPrice(modifier.value)">
            ({{ formatPrice(modifier.value) }})
          </div>
        </label>
      </div>
      <div
        class="text-danger"
        v-if="subgroup.item_type == 'mandatory'"
        v-show="error"
      >
        {{ error }}
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
