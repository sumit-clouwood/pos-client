<template>
  <!-- Manage Customers -->
  <div>
    <div class="modal fade offline" id="manage-customer" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-dialog-centered">
        <!-- Modal content-->
        <div class="modal-content color-dashboard-background">
          <div class="modal-header customer-header color-secondary">
            <h4 class="customer-title color-text-invert">
              {{ _t('Create New Customer') + ' ' + _t('offline') }}
            </h4>
            <button type="button" class="close color-text" data-dismiss="modal">
              &times;
            </button>
          </div>
          <CustomerForm ref="form" />
          <div class="modal-footer">
            <div class="btn-announce">
              <button
                class="btn btn-success btn-large color-main"
                type="button"
                id="post_announcement"
                v-on:click="post"
              >
                {{ _t('Save') }}
              </button>
              <button
                type="button"
                class="btn btn-danger cancel-announce color-button"
                data-dismiss="modal"
                id="close-customer"
              >
                {{ _t('Cancel') }}
              </button>
            </div>
            <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
          </div>
        </div>
      </div>
    </div>
    <InformationPopup :responseInformation="message" :title="title" />
  </div>
  <!-- End Manage Customers -->
</template>

<script>
/* global $ */
/* eslint-disable no-console */
import { mapGetters } from 'vuex'
import InformationPopup from '@/components/pos/content/InformationPopup'
import CustomerForm from './ManageCustomer/CustomerForm'

export default {
  name: 'ManageCustomer',
  props: {},
  computed: {
    ...mapGetters('location', ['_t']),
  },
  data: function() {
    return {
      title: 'Customer Success',
      status: 0,
      message: '',
    }
  },
  components: { InformationPopup, CustomerForm },
  methods: {
    post() {
      console.log('posting')
      this.$store.commit('order/ORDER_TYPE', {
        OTview: 'Delivery',
        OTApi: 'call_center',
      })
      const errors = this.$refs.form.validate()
      console.log('form errors', errors)
      if (errors.count === 0) {
        const data = this.$refs.form.getData()
        if (typeof data.email === 'undefined') {
          data.email = ''
        }
        console.log(data)

        if (!data.city) {
          data.city = this.$store.state.location.store.city
        }
        if (!data.country) {
          data.country = this.$store.state.location.store.country
        }

        this.$store.dispatch('customer/setOfflineData', data)
        this.status = 1
        this.message = 'Data saved for offline order'
        this.$store.commit('location/SET_MODAL', '#order-confirmation')

        $('#manage-customer').modal('hide')
        $('#information-popup').modal('show')
        this.$refs.form.reset()
      }
    },
  },
}
</script>
<style scoped>
.modal-dialog {
  width: 1180px !important;
  max-width: 1180px !important;
}
</style>
<style lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  #manage-customer {
    .modal-dialog {
      .modal-content {
        overflow-y: auto;
        overflow-x: hidden !important;
        .modal-header {
          width: 100vw;
          border: none;
        }

        .modal-body {
          padding-top: 0 !important;
          overflow: hidden;
          display: grid;
          grid-template-rows: max-content 1fr;
          padding-bottom: 0;
          height: calc(100vh - 250px);
          width: 95% !important;
        }

        .modal-body {
          padding-top: 0;
          overflow: hidden;
          display: grid;
          grid-template-rows: max-content 1fr;
          padding-bottom: 0;

          .divide-block {
            border: none;
            margin: 0;

            .customer-block-info {
              padding: 0;
              position: static;
            }

            .left-form,
            .right-form {
              padding: 0;

              .customer-group {
                margin-bottom: 10px;
              }

              .name-from {
                margin-bottom: 10px;
              }

              .color-text-invert {
                padding-left: 0;
              }

              input,
              select {
                width: 100%;
              }

              .validation-error {
                position: static;
              }
            }

            .vdatetime {
              width: 100%;
            }
          }

          .search-field {
            margin-left: -20px;
            margin-right: -20px;
            border-radius: 0;
            border-left: none;
            border-right: none;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-bottom: none;
            margin-top: 10px !important;
          }

          .manage-customer-table {
            max-height: none;
            .table {
              thead {
                display: none;
              }

              tbody {
                display: grid;
                grid-gap: 20px;
                width: 100%;
                padding-top: 20px;

                tr {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  border-radius: 5px;
                  border: 1px solid $gray-middle;
                  overflow: hidden;

                  td {
                    display: grid;
                    align-items: center;
                    height: 40px;
                    width: 100%;
                    border: none;
                    max-width: none;
                    padding-left: 10px;

                    button {
                      height: 100%;
                      border-radius: 0;
                    }

                    &.color-text {
                      grid-column-start: 1;
                      grid-column-end: 2;
                    }

                    &:empty {
                      display: none;
                    }

                    &:nth-child(5),
                    &:nth-child(6) {
                      grid-column-start: 2;
                      grid-column-end: 3;
                      padding: 0;
                    }

                    &:nth-child(5) {
                      grid-row-start: 1;
                      grid-row-end: 2;
                      button {
                        background-color: #f99c32;
                      }
                    }

                    &:nth-child(6) {
                      grid-row-start: 2;
                      grid-row-end: 3;
                      button {
                        background-color: #64c434;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        .modal-footer {
          width: 100vw;
          z-index: 10;
          display: grid;
          grid-template-columns: 1fr;
          .pagination-customer-details {
            display: grid;
            grid-template-columns: max-content;
            justify-content: center;
            margin-bottom: 20px;
            margin-right: 0;
          }
          .btn-announce {
            width: 95% !important;
            #cust-new {
              margin-left: 0;
            }
            button {
              width: 100%;
            }
            .btn-danger {
              border: none;
              &:after {
                font-size: 16px;

                color: #444;
                position: absolute;
                right: -10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
