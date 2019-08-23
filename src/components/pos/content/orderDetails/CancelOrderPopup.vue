<template>
  <div
    class="modal fade cancel-order"
    id="cancellationReason"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">{{ _t('Cancel Order') }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="upper">
            <div class="autocomplete-container" v-if="cancellationReason">
              <div class="driver-container">
                <div class="select-driver">{{ _t('Cancellation Reason') }}</div>
                <form>
                  <input
                    autocomplete="off"
                    type="text"
                    class="input-search-driver"
                    id="get-customer-list"
                    v-model="showSelectedReason"
                    @click="showDropdown"
                  />
                </form>
                <div id="my-dropdown" class="dropdown-content cursor-pointer">
                  <span
                    class="dropdown"
                    v-for="reason in cancellationReason"
                    :key="reason._id"
                    v-on:click="selectedReason(reason)"
                  >{{ reason.name }}</span>
                </div>
                <p
                  v-if="errors && errors.cancel_reason.length"
                  class="text-danger"
                >{{ errors.cancel_reason }}</p>
              </div>
              <div>
                <div class="select-driver">{{ _t('Supervisor Password') }}</div>
                <div>
                  <input
                    autocomplete="off"
                    type="password"
                    class="input-search-driver"
                    v-model="supervisorPassword"
                  />
                </div>
                <p
                  v-if="errors && errors.supervisor_password.length"
                  class="text-danger"
                >{{ errors.supervisor_password.toString() }}</p>
              </div>
            </div>
            <div v-else class="drivers-list-note">{{ _t('No reason found') }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">{{ _t('Close') }}</button>
          <button
            type="button"
            class="btn btn-success"
            @click="
              cancelOrderAction({
                order: selectedOrder.item,
              })
            "
          >{{ _t('Submit') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
/* global $ */
export default {
  name: "CancelOrderPopup",
  data() {
    return {
      showSelectedReason: "",
      supervisorPassword: ""
    };
  },
  computed: {
    ...mapGetters("location", ["_t"]),
    ...mapState("order", ["cancellationReason", "selectedOrder", "errors"])
  },
  methods: {
    selectedReason: function(reason) {
      this.showSelectedReason = reason.name;
      $(".dropdown-content").hide();
    },
    showDropdown: function() {
      $(".dropdown-content").toggle();
    },
    cancelOrderAction: function(order) {
      let data = {
        cancel_reason: this.showSelectedReason,
        supervisor_password: this.supervisorPassword
      };
      let orderType = "call_center";
      let actionTrigger = "cancel_order";
      this.updateOrderCancelAction({
        order,
        orderType,
        actionTrigger,
        params: data
      });
    },
    ...mapActions("order", ["selectedOrderDetails", "updateOrderCancelAction"])
  }
};
</script>

<style lang="scss">
@import "../../../../assets/scss/pixels_rem.scss";
@import "../../../../assets/scss/variables.scss";
@import "../../../../assets/scss/mixins.scss";

#cancellationReason {
  .modal-dialog {
    /*margin: 0;*/
  }
}

#cancellationReason {
  .modal-dialog {
    margin: 0;

    .modal-content {
      .modal-header {
        height: 80px;
        background-color: #fff;
      }

      .modal-body {
      }

      .modal-footer {
      }
    }
  }
}

@include responsive(mobile) {
  #cancellationReason {
    .modal-dialog {
      .modal-content {
        .modal-header {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: none;
        }

        .modal-body {
        }

        .modal-footer {
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}
</style>
