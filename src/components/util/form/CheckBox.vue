<template>
  <div class="POSItemOptions_choose POSItemOptions_choose_radio">
    <div class="POSItemOptions_choose_choice">
      <label class="POSItemOptions_choose_label">
        <input
          type="checkbox"
          v-bind:value="value"
          v-on:change="
            $emit('change', { index: index, checked: $event.target.checked })
          "
          v-on:input="$emit('input', $event.target.checked)"
        />
        <div class="borderCheck">
          <span class="customradioc">
            <span class="checkBox"></span>
          </span>
        </div>
        <span class="color-text"> {{ title }}</span>
      </label>
    </div>
  </div>
</template>
<!-- <radio v-model="radios"></radio> -->

<script>
export default {
  name: 'Checkbox',
  components: {},
  props: ['value', 'title', 'index'],
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.POSItemOptions_choose {
  margin-top: $px10;
  margin-left: $px10;
  display: grid;
  grid-template-columns: repeat(auto-fill, 60px);
  grid-gap: 10px;
  position: relative;
  .text-danger {
    position: absolute;
    top: -22px;
    font-size: 12px;
    z-index: 10;
  }

  &.POSItemOptions_choose_radio {
    .POSItemOptions_choose_choice {
      .container-radio-btn {
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
        margin: 0;
        border: 2px solid $gray-middle;
        padding: 4px;
        border-radius: 3px;
        position: relative;
        width: calc(100% + 30px);
        height: 100%;
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
    cursor: pointer;
    padding: 2px;
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
        width: $px35;
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
</style>
