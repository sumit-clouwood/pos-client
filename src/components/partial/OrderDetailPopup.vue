<template>
  <div
    class="modal fade bd-example-modal-lg"
    tabindex="-1"
    role="dialog"
    aria-labelledby="myLargeModalLabel"
    aria-hidden="true"
    id="orderDetailsPopup"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="col-md-5">
          <div data-v-f6351270="" class="left-part">
            <LeftPart />
          </div>
        </div>
        <div class="col-md-7 right-part">
          <div class="tab-content" id="nav-tabContent">
            <RightPartHeader />
            <RightPartContent />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RightPartContent from '@/components/partial/orderDetails/RightPartContent'
import RightPartHeader from '@/components/partial/orderDetails/RightPartHeader'
import LeftPart from '@/components/partial/orderDetails/LeftPart'
export default {
  name: 'OrderDetailPopup',
  props: {},
  components: {
    RightPartHeader,
    RightPartContent,
    LeftPart,
  },
}
</script>
<style scoped lang="scss">
#orderDetailsPopup .modal-dialog {
  max-width: 70%;
}
#orderDetailsPopup .modal-content {
  flex-direction: row;
}
div#nav-tabContent {
  margin: 25px;
}
</style>
