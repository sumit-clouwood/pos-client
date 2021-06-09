<template>
  <div class="sitting-image">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="94vw"
      height="100%"
      id="dine-in-area"
      ref="dine-in-area"
      :viewBox="
        viewBox.x + ' ' + viewBox.y + ' ' + viewBox.width + ' ' + viewBox.height
      "
      preserveAspectRatio="xMidYMid meet"
    />
  </div>
</template>

<script>
export default {
  name: 'AllTables',
  props: {
    viewBox: Object,
  },
}
</script>
