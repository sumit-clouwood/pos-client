<template>
  <!-- Modal -->
  <div
    class="modal fade POSItemOptions"
    id="POSItemOptions"
    tabindex="-1"
    role="dialog"
    aria-labelledby="POSItemOptions"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-wrapper"
      role="document"
    >
      <div
        class="modal-content color-dashboard-background modal-content-wrapper footerStyle"
      >
        <Header />
        <HeaderDetails />
        <Content />
        <Footer />
      </div>
    </div>
  </div>
  <!-- End Model -->
</template>

<script>
/* global $ */
import { bus } from '@/eventBus'
import Header from './popup/Header'
import HeaderDetails from './popup/header/HeaderDetails'
import Content from './popup/Content'
import Footer from './popup/Footer'
import { mapGetters } from 'vuex'

export default {
  name: 'Popup',
  props: {},
  data() {
    return {
      modifierBlockHeight: 0,
      modifierBlockInitHeight: 0,
      modifierBlockItemHeight: 0,
    }
  },
  computed: {
    ...mapGetters('combo', ['current_combo_selected_item']),
  },
  components: {
    Content,
    Header,
    HeaderDetails,
    Footer,
  },
  mounted() {
    bus.$on('modifier-height', () => {
      setTimeout(() => {
        if ($('#POSItemOptions').hasClass('show')) {
          this.modifierScroll()
        }
      }, 300)
    })
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
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  .POSItemOptions {
    padding: 0;
    width: 100vw;
    max-width: none;
    overflow: hidden;
    // position: fixed;

    .modal-dialog {
      margin-top: 2rem !important;
      .modal-content {
        display: flex;
        flex-direction: column;
        width: 95% !important;
        margin: auto !important;
        font-size: 16px !important;
        max-height: 80vh !important;
        overflow: auto;

        .modal-header {
          height: 70px;
          background-color: #d7dce2;
          margin: 0;
        }

        .modal-details {
          padding: 0 25px;
          padding-left: 0px !important;
          border: none;
          z-index: 1;
          background-color: #fff;
          display: flex;
          flex-wrap: wrap;
          flex-direction: column-reverse;
          .POSItemOptions_pricequantity {
            .POSItemOptions_price {
              .POSItemOptions_money {
                color: #6ec841;
              }
            }

            .POSItemOptions_quantity {
              position: fixed;
              bottom: 0;
              right: 0;
              left: 0;
              padding: 0.75px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              width: 100%;
              background-color: #fff;
              z-index: 1;

              .POSItemOptions_quantity_wrapper {
                align-items: center;

                .POSItemOptions_quantity_submit {
                  button {
                    height: 50px;
                    background-color: $green-middle;
                    width: auto !important;
                    padding: 0 25px;
                  }
                }
              }

              .POSItemOptions_label {
                padding-left: 8px !important;
                /*display: none;*/
              }
            }
          }
        }

        .modal-body {
          margin: 0;
          max-height: none;
          order: 4;
          // margin-bottom: 75px;

          .POSItemOption {
            margin-bottom: 20px;

            .POSItemOptions_type {
              .POSItemOptions_typehead {
                .color-text-invert {
                  text-transform: uppercase;
                }
              }

              .POSItemOptions_typeline {
                display: none;
              }
            }

            .POSItemOptions_choose {
              margin-top: 10px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-gap: 20px;
              position: relative;
              .POSItemOptions_choose_choice {
                width: auto;
                margin-bottom: 0;

                .POSItemOptions_choose_label {
                  padding: 10px;
                  border: 2px solid $gray-middle;
                  border-radius: 5px;
                  position: relative;
                  display: flex;
                  align-items: center;
                  position: relative;
                  flex-wrap: wrap;

                  &.active {
                    border: 2px solid $green-middle;
                  }

                  img {
                    flex-basis: max-content;
                    flex-shrink: 0;
                    border-radius: 50%;
                    margin-bottom: 5px;
                  }

                  .customradioc {
                    display: inline-flex;
                    margin: 0;
                    position: absolute;
                    width: 20px;
                    height: 20px;
                  }

                  input {
                    &[type='checkbox'] {
                      &:checked + div {
                        display: block;

                        span {
                          background-color: $green-middle;
                          border: none;
                          border-radius: 3px;
                        }
                      }
                    }
                  }

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

                  .borderCheck {
                    display: none;
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    bottom: -2px;
                    left: -2px;
                    border: 2px solid $green-middle;
                    border-radius: 3px;
                    pointer-events: none;
                  }
                }
              }
            }
          }
        }

        .modal-footer {
          grid-row-start: auto !important;
          grid-row-end: auto !important;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

          .buttoned {
            width: auto;
            height: 50px;
            padding: 0 25px !important;

            img {
              margin-right: 10px;
            }
          }

          .btn-announce {
            margin: 0;
            justify-content: space-between;
            grid-gap: 10px;
            &.apply_btn {
              grid-template-columns: 1fr;
            }

            button {
              margin: 0;
              padding: 0 10px !important;
              height: 30px;
              box-shadow: none !important;
              height: 35px;
              //   background-color: $green-middle !important;
            }
          }
        }

        &.footerStyle {
          .modal-footer {
            grid-row-start: 3;
            grid-row-end: 4;
          }
        }
      }
    }
  }
  .modal-content-wrapper {
    margin: 0 !important;
    overflow: hidden;
  }
  .modal-dialog-wrapper {
    margin: 0 !important;
  }
}
</style>
