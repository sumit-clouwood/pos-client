<template>
  <div class="breadcrumbs color-dashboard-background">
    <div class="breadcrumbs-item breadcrumbs-category">
      <div class="title-box">
        <div class="breadcrumbs-subtitle color-text-invert">
          {{ _t("Category") }}
        </div>
        <div
          class="breadcrumbs-title shorten-sentence color-text"
          :title="dt(category)"
        >
          {{ dt(category) }}
        </div>
      </div>
      <i class="fa fa-chevron-right color-text-invert"></i>
    </div>
    <div class="breadcrumbs-item breadcrumbs-sub-category" v-if="subcategory">
      <div class="title-box">
        <div class="breadcrumbs-subtitle">{{ _t("Sub Category Name") }}</div>
        <div
          class="breadcrumbs-title shorten-sentence"
          :title="dt(subcategory)"
        >
          {{ dt(subcategory) }}
        </div>
      </div>
      <i class="fa fa-chevron-right color-text-invert"></i>
    </div>
    <div class="breadcrumbs-item breadcrumbs-menu" v-if="item">
      <div class="title-box">
        <div class="breadcrumbs-subtitle">{{ _t("Item") }}</div>
        <div class="breadcrumbs-title shorten-sentence" :title="dt(item)">
          {{ dt(item) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "Breadcrumbs",
  props: {
    msg: String
  },
  computed: {
    ...mapState("category", ["category", "subcategory", "item"]),
    ...mapGetters("location", ["_t"])
  }
};
</script>
<style scoped>
/*ul.ullist-category {
  width: 500px !important;
}*/
</style>
