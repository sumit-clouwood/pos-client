<template>
  <div class="catalog col-md-8 left-container">
    <search />
    <div class="row">
      <SubMenu />
      <Items />
    </div>
  </div>
</template>

<script>
import Items from "./catalog/Items";
import Search from "./catalog/Search";
import SubMenu from "./catalog/SubMenu";

export default {
  name: "Catalog",
  props: {
    msg: String
  },
  components: {
    Items,
    Search,
    SubMenu
  }
};
</script>
