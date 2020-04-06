<template>
  <div class="modal-footer">
    <div class="btn-announce">
      <ModifyItemModifiersButton
        v-if="show('modifiers') && device === 'mobile'"
      />
      <note-button v-if="show('note')"></note-button>
      <DiscountButton v-if="show('discount')" />
      <!-- <RemoveDiscountButton /> -->
      <RemoveTaxButton v-if="show('removeTax')" />
      <ModifyItemModifiersButton
        v-if="show('modifiers') && device !== 'mobile'"
      />
      <button
        v-if="
          !show('removeTax') &&
            !show('note') &&
            !show('modifiers') &&
            !show('discount')
        "
        type="button"
        class="btn btn-danger"
        data-dismiss="modal"
      >
        {{ _t('Close') }}
      </button>
    </div>
  </div>
</template>

<script>
//this footer ll be called only when we come through order
import DiscountButton from './footer/DiscountButton'
import noteButton from './footer/buttons/note'
//import RemoveDiscountButton from './footer/RemoveDiscountButton'
import RemoveTaxButton from './footer/RemoveTaxButton'
import ModifyItemModifiersButton from './footer/ModifyItemModifiersButton'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Footer',
  props: {},
  components: {
    DiscountButton,
    noteButton,
    //  RemoveDiscountButton,
    RemoveTaxButton,
    ModifyItemModifiersButton,
  },
  computed: {
    ...mapGetters('auth', ['allowed', 'waiter', 'carhop']),
    ...mapGetters('location', ['_t']),
    ...mapState('order', ['item', 'orderSource']),
    ...mapGetters(['device']),
  },
  methods: {
    show(option) {
      let allowed = true

      if (this.carhop || this.waiter) {
        //carhop or waiter, both ll be always placing order so they can add/change note
        switch (option) {
          case 'removeTax':
          case 'discount':
            allowed = false
            break
          case 'modifiers':
          case 'note':
            if (typeof this.item.no !== 'undefined') {
              allowed = false
            }
            break
        }
      } else {
        //cashier | other users
        if (typeof this.item.no !== 'undefined') {
          //they can place and pay for order, but they can not change note for already placed item
          //can add discount but can't remove tax and add modifiers
          switch (option) {
            case 'removeTax':
            case 'modifiers':
              //not backend and still *editing* order? that means its carhop or waiter order

              if (this.orderSource !== 'backend') {
                allowed = false
              }
              break
            case 'note':
              if (
                typeof this.item.no !== 'undefined' &&
                this.orderSource !== 'backend'
              ) {
                allowed = false
              }
              break
          }
        }
      }
      return allowed
    },
  },
}
</script>
