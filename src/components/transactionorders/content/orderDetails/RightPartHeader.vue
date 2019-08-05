<template>
  <nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
      <a
        class="nav-item nav-link active color-text-invert"
        id="nav-home-tab"
        data-toggle="tab"
        href="#nav-home"
        role="tab"
        aria-controls="nav-home"
        aria-selected="true"
        >{{ _t('Receipt') }}</a
      >
      <a
        class="nav-item nav-link color-text-invert"
        id="nav-profile-tab"
        data-toggle="tab"
        href="#nav-profile"
        role="tab"
        aria-controls="nav-profile"
        aria-selected="false"
        >{{ _t('History') }}</a
      >
      <a
        class="nav-item nav-link color-text-invert"
        id="nav-contact-tab"
        data-toggle="tab"
        href="#nav-contact"
        role="tab"
        aria-controls="nav-contact color-text-invert"
        aria-selected="false"
        >{{ _t('Modifications') }}</a
      >
      <a
        class="nav-item nav-link color-text-invert"
        id="nav-payments-tab"
        data-toggle="tab"
        href="#nav-payments"
        role="tab"
        aria-controls="nav-payments color-text-invert"
        aria-selected="false"
        >{{ _t('Payments') }}</a
      >
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RightPartHeader',
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>

<style scoped></style>
