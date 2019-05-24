<template>
  <nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
      <a
        class="nav-item nav-link active"
        id="nav-home-tab"
        data-toggle="tab"
        href="#nav-home"
        role="tab"
        aria-controls="nav-home"
        aria-selected="true"
        >Receipt</a
      >
      <a
        class="nav-item nav-link"
        id="nav-profile-tab"
        data-toggle="tab"
        href="#nav-profile"
        role="tab"
        aria-controls="nav-profile"
        aria-selected="false"
        >History</a
      >
      <a
        class="nav-item nav-link"
        id="nav-contact-tab"
        data-toggle="tab"
        href="#nav-contact"
        role="tab"
        aria-controls="nav-contact"
        aria-selected="false"
        >Modifications</a
      >
      <a
        class="nav-item nav-link"
        id="nav-payments-tab"
        data-toggle="tab"
        href="#nav-contact"
        role="tab"
        aria-controls="nav-contact"
        aria-selected="false"
        >Payments</a
      >
    </div>
  </nav>
</template>

<script>
export default {
  name: 'RightPartHeader',
}
</script>

<style scoped></style>
