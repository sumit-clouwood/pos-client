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
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content color-dashboard-background footerStyle">
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
import Header from './popup/Header'
import HeaderDetails from './popup/header/HeaderDetails'
import Content from './popup/Content'
import Footer from './popup/Footer'

export default {
  name: 'Popup',
  props: {},
  components: {
    Content,
    Header,
    HeaderDetails,
    Footer,
  },
}
</script>
<style lang="scss">
@import '../../../../../assets/scss/pixels_rem.scss';
@import '../../../../../assets/scss/variables.scss';
@import '../../../../../assets/scss/mixins.scss';

@include responsive(mobile) {
  .POSItemOptions {
    padding: 0;

    .modal-dialog {
      width: 100vw;
      max-width: none;
      min-width: 100vw;

      .modal-content {
        display: flex;
        flex-direction: column;

        .modal-header {
          height: 70px;
          background-color: #fff;
          margin: 0;
        }

        .modal-details {
          padding: 0 25px;
          border: none;
          z-index: 1;
          background-color: #fff;

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
              padding: 20px;
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
                  }
                }
              }

              .POSItemOptions_label {
                display: none;
              }
            }
          }
        }

        .modal-body {
          margin: 0;
          max-height: none;
          order: 4;
          margin-bottom: 75px;

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
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            margin: 0;
            justify-content: space-between;
            grid-gap: 10px;
            width: 100%;

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
}
</style>
