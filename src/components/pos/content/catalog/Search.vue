<template>
    <div class="search-field">
        <div class="search-field-icon" @click="searchHendlerChange()">
            <!--<img class="search-field-img" src="images/search-icon.png" alt="search">-->
            <i class="fa fa-search" aria-hidden="true"></i>
        </div>
        <input
                type="text"
                :class="['search-field-input', {active: searchHendler}]"
                :placeholder="_t('Start typing to get search results')"
                v-model="searchItems"
                @keyup="collectSearchItems(searchItems)"
        >
        <div :class="['allCategory', 'hideBigScreen', {notActive: searchHendler}, {active: allCategoryHendler}]" @click="allCategoryHendlerChange">
            All category
            <i class="fa fa-angle-down" aria-hidden="true"></i>
        </div>
        <div :class="['subCategory', 'hideBigScreen', {notActive: searchHendler}, {active: subCategoryHendler}]" @click="subCategoryHendlerChange">
            Sub category
            <i class="fa fa-angle-down" aria-hidden="true"></i>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "Search",
        props: {},
        data() {
            return {
                searchItems: ""
            };
        },
        computed: {
            ...mapGetters("location", ["_t",]),
            ...mapGetters(["searchHendler", "allCategoryHendler", 'subCategoryHendler'])
        },
        methods: {
            ...mapActions("category", ["collectSearchItems"]),
            searchHendlerChange() {
                this.$store.dispatch('searchHendlerChange');
            },
            allCategoryHendlerChange(){
                this.$store.dispatch('allCategoryHendlerChange');
            },
            subCategoryHendlerChange(){
                this.$store.dispatch('subCategoryHendlerChange');
            }
        },
    };
</script>
