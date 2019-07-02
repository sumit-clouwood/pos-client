<template>
  <div>
    <SystemNavigation />

    <!--body content left-->
    <div class="content-wrapper" id="dp-content-wrapper">
      <DSItems />
      <!--<div class="block1-wrap-dp">
                    &lt;!&ndash;next 4 items&ndash;&gt;
                </div>
                <div class="block1-wrap-dp" id="hide-block1-dp">
                    &lt;!&ndash;next page items&ndash;&gt;
                </div>
            </div>-->
    </div>
    <DSFooter />

    <div class="modal-backdrop fade show" id="transparent-screen"></div>
  </div>
</template>

<script>
import SystemNavigation from "@/components/SystemNavigation";
import DSItems from "@/components/dispatchScreen/DSItems";
import DSFooter from "@/components/dispatchScreen/DSFooter";

export default {
  name: "DispatchScreen",
  components: {
    SystemNavigation,
    DSItems,
    DSFooter
  }
};
</script>

<style scoped></style>
