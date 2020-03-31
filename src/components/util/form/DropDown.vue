<template>
  <div class="dropdown" :id="'dropdown' + currentKey">
    <div class="dropdown-menu" :id="'dropdownMenuButton' + currentKey">
      <div
        v-for="(method, key) in value"
        :key="key"
        @click.stop="selectSlide({ index: currentKey, slide: method })"
        class="dropdown-item slide"
      >
        <img :src="method.icon" :id="key" />
        <label class="shorten-sentence" :title="method.name" :id="key">
          {{ method.name }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropDown',
  props: ['value', 'show', 'currentKey'],
  methods: {
    selectSlide(payLoad) {
      this.$emit('select-slide', payLoad)
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.dropdown {
  .dropdown-menu {
    border-radius: 2px;
    overflow-y: scroll;
    max-height: 10rem;
    max-width: 10rem;
    z-index: 999;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }
  .dropdown-item {
    animation-name: leftToRight;
    animation-duration: 1s;
    animation-delay: (150ms * 2) - 300;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
  }
  .slide {
    border-radius: 3px;
    background-color: #ffffff;
    border: solid 1px #dbdfe9;
    cursor: pointer;
    justify-content: center;
    padding: 4px;
  }
  img {
    width: 46px;
    height: 46px;
    display: block;
    margin: 0 auto;
    border-style: none;
  }
  label {
    display: block;
    cursor: pointer;
    text-align: center;
  }
  .shorten-sentance {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 6.9375rem;
    margin: auto;
    text-align: center;
  }
}
@keyframes leftToRight {
  0% {
    opacity: 0;
    transform: rotateY(-90deg) translateY(30px);
  }
  100% {
    opacity: 1;
    transform: rotateY(0deg) translateY(0px);
  }
}
</style>
