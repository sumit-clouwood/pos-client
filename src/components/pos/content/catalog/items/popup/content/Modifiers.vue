<template>
  <div class="POSItemOption" v-if="subgroup">
    <div class="POSItemOptions_type">
      <h3 class="POSItemOptions_typehead color-secondary">
        <!--<span>{{ subgroup.name }} ({{ subgroup.item_type }}) </span>-->
        <span class="color-text-invert">{{ _t(subgroup.name) }}</span>
      </h3>
      <span class="POSItemOptions_typeline"></span>
    </div>
    <div class="POSItemOptions_choose POSItemOptions_choose_radio">
      <div
        class="text-danger color-warning"
        v-if="subgroup.item_type == 'mandatory'"
        v-show="error"
      >
        {{ error }}
      </div>
      <div
        v-for="modifier in subgroup.modifiers"
        :key="modifier._id"
        class="POSItemOptions_choose_choice entityModifier"
      >
        <label
          :class="['POSItemOptions_choose_label', modifier.class]"
          v-if="subgroup.no_of_selection > 1"
        >
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
          <div class="borderCheck">
            <span class="customradioc">
              <span class="checkBox"></span>
            </span>
          </div>
          <img
            :src="modifier.item_modifier_image"
            alt
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
          <div class="label-text">
            <span class="color-text">{{ dt(modifier) }}</span>
            <div
              class="color-text-price itm-price"
              v-if="Num.toPrice(modifier.value)"
            >
              ({{ formatPrice(modifier.value) }})
            </div>
          </div>
        </label>

        <label class="container-radio-btn" v-else>
          <input
            v-if="item.editMode"
            type="radio"
            class="customradio modifier-option-radio"
            :id="modifier._id"
            :name="subgroup._id"
            :value="modifier._id"
            @click="setRadio(item._id, subgroup._id, modifier._id)"
            :checked="
              isSelected({
                modifierId: modifier._id,
                groupId: subgroup._id,
                itemId: item._id,
              })
            "
          />
          <input
            v-else
            type="radio"
            class="customradio modifier-option-radio"
            :id="modifier._id"
            :name="subgroup._id"
            :value="modifier._id"
            @click="setRadio(item._id, subgroup._id, modifier._id)"
          />
          <div class="borderCheck">
            <span class="customradioc">
              <span class="checkBox"></span>
            </span>
          </div>
          <span class="customradioc-block">
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
            alt
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
          <span class="color-text">{{ dt(modifier) }}</span>
          <div class="color-text dis" v-if="Num.toPrice(modifier.value)">
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
    ...mapGetters('location', ['formatPrice', '_t']),
  },
  mounted() {},
  methods: {
    addClass(index) {
      if (this.subgroup.modifiers[index].class !== 'active') {
        this.subgroup.modifiers[index].class = 'active'
      } else {
        this.subgroup.modifiers[index].class = ''
      }
    },
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
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

.POSItemOption {
  .POSItemOptions_type {
    position: relative;

    .POSItemOptions_typehead {
      color: #222;
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 0.43px;
      margin: 0;
      background-color: #fff;
      padding-right: $px15;
      display: inline-block;
      vertical-align: middle;
      position: relative;
      z-index: 2;
    }

    .POSItemOptions_typeline {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      width: 100%;
      height: 1px;
      background-color: #e3e7f2;
      z-index: 1;
    }
  }

  .POSItemOptions_choose {
    margin-top: $px30;
    display: grid;
    grid-template-columns: repeat(auto-fill, 150px);
    @include responsive(mobile) {
      grid-template-columns: 1fr 1fr;
      font-size: 1rem;
    }
    grid-gap: 10px;
    position: relative;
    .text-danger {
      position: absolute;
      top: -22px;
      font-size: 12px;
      z-index: 10;
      @include responsive(mobile) {
        position: absolute;
        right: 0;
      }
    }

    &.POSItemOptions_choose_radio {
      .POSItemOptions_choose_choice {
        .container-radio-btn {
          display: inline-block;
          vertical-align: middle;
          margin: 0;
          border: 2px solid $gray-middle;
          padding: 10px;
          border-radius: 3px;
          position: relative;
          width: 100%;
          height: 100%;
          @include responsive(mobile) {
            text-align: center;
            padding: 5px !important;
          }
          input {
            display: none;

            &[type='radio'] {
              background: #fff;

              &:checked + div {
                display: block;

                span {
                  background-color: $blue-middle;
                  border: none;
                  border-radius: 50%;
                  width: inherit;
                  @include responsive(mobile) {
                    background-color: $green-middle;
                  }
                }
              }
            }
          }
          .dis {
            padding-top: 0px;
            padding-left: 27px;
          }
          .borderCheck {
            display: none;
            position: absolute;
            top: -2px;
            right: -2px;
            bottom: -2px;
            left: -2px;
            border: 2px solid $blue-middle;
            border-radius: 3px;
            pointer-events: none;
            @include responsive(mobile) {
              border: 2px solid $green-middle;
            }

            .customradioc {
              position: absolute;
              top: 5px;
              right: 5px;
              margin: 0;
              color: #fff;
              border-radius: 50%;

              .checkBox {
                width: 20px;
                height: 20px;
                line-height: inherit;
                border-top: none;
                border-right: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: none;

                &:before {
                  position: static !important;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 10px;
                  height: 10px;
                  background-color: #fff;
                  border-radius: 50%;
                  border: none;
                  overflow: hidden;
                }
              }
            }
          }

          .customradioc-block {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 20px;
            height: 20px;
            background-color: $green-middle;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            display: none;

            .checkmark-radio-btn {
              margin: 0;
              border: none;
              width: 100%;
              height: 100%;
              background-color: transparent;
              display: flex;
              align-items: center;
              justify-content: center;

              &:after {
                font-family: 'FontAwesome';
                content: '\F00C';
                background-color: transparent;
                color: #fff;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                // display: none;
              }
            }
          }

          img {
            border-radius: 50%;
          }
        }
      }
    }

    .POSItemOptions_choose_label {
      padding: 10px;
      border-radius: 5px;
      position: relative;

      .borderCheck {
        display: none;
      }

      .customradioc {
        position: absolute;
        top: -1px;
        right: -1px;
        margin-right: 0 !important;
        width: 20px;
        height: 20px;

        input {
          display: none;
        }

        span {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          border: 2px solid $gray-middle;
          border-radius: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          text-align: center;
          color: #3d3f43;
          font-size: $px12;
          font-weight: normal;
          letter-spacing: 0.43px;
          width: 20px;
          height: 20px;

          &:before {
            width: 15px !important;
            height: 15px !important;
            color: #fff;
          }
        }

        input[type='checkbox']:checked + span {
          background: $blue-middle;
          border-color: $blue-middle;
          position: relative;
        }

        input[type='checkbox'] {
          opacity: 0;
          position: absolute;
          top: 4px;
          width: $px10;
          height: $px10;
        }

        input[type='checkbox']:checked + span:before {
          font-family: 'FontAwesome';
          content: '\f00c';
          width: $px12;
          height: $px12;
          color: #fff;
          line-height: 0;
          position: absolute;
          top: 7.5px;
          left: 0.5px;
          font-size: $px15 !important;
        }

        input[type='checkbox'] + span {
          border-radius: 2px;
        }
      }
    }

    .POSItemOptions_choose_choice {
      display: inline-block;
      margin-bottom: $px18;

      .POSItemOptions_choose_label {
        display: inline-block;
        vertical-align: middle;
        margin: 0;
        border: 2px solid $gray-middle;
        width: 100%;
        display: flex;
        align-items: center;
        height: 100%;
        .label-text {
        }
        .color-text {
          width: 67%;
          height: 100%;
          display: contents;
        }

        input {
          display: none;
          /* &[type="checkbox"] {
                                     &:checked + span {
                                         background-color: $green-middle;
                                     }
                                 }*/
          &[type='checkbox'] {
            &:checked + div {
              display: block;

              span {
                background-color: $blue-middle;
                border: none;
                border-radius: 3px;
              }
            }
          }
        }

        img {
          margin-right: $px5;
          display: inline-block;
          vertical-align: middle;
          min-width: $px35;
          max-width: $px35;
          height: $px35;
          border-radius: 50%;
        }

        span {
          display: inline-block;
          vertical-align: middle;
          line-height: 1.3;
        }
      }

      .customradioc {
        display: inline-block;
        vertical-align: middle;
        margin-right: $px5;

        .checkBox {
          width: 20px;
          height: 20px;
          line-height: inherit;
          border-top: none;
          border-right: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;

          &:before {
            font-family: 'FontAwesome';
            content: '\f00c';
            position: static !important;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px !important;
            border: none;
          }
        }
      }

      .borderCheck {
        display: none;
        position: absolute;
        top: -2px;
        right: -2px;
        bottom: -2px;
        left: -2px;
        border: 2px solid $blue-middle;
        border-radius: 3px;
        pointer-events: none;
      }
    }
  }
}
</style>
