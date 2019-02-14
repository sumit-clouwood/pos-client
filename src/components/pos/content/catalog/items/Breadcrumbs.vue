<template>
  <div class="breadcrumb-category">
    <ul class="ullist-category">
      <li><span>Choose Category</span>
        <p>Pizza</p><span class="arrows"><img src="img/pos/right-arrow.png" alt="right-arrow"></span></li>
      <li><span>Choose Sub Category</span>
        <p>Pizza Small</p><span class="arrows"><img src="img/pos/right-arrow.png" alt="right-arrow"></span>
      </li>
      <li><span>Choose Menu</span>
        <p>Vegetable Pizza</p></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  props: {
    msg: String
  }
}
</script>