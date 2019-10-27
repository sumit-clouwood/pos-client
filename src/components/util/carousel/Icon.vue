<template>
  <svg>
    <use :xlink:href="'#' + use" />
  </svg>
</template>

<script>
export default {
  name: 'app-icon',
  props: ['use'],
}
</script>
<style lang="scss" scoped>
[class*='c-app-icon'] {
  display: inline-block;
  fill: color('dark');
}

.c-app-icon-arrow-next,
.c-app-icon-arrow-prev {
  width: rem(16px);
  height: rem(31px);
  fill: color('grey');
}

.c-app-icon-arrow-prev {
  transform: rotate(180deg);
}
</style>
