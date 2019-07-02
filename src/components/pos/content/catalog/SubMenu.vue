<template>
    <div :class="['food-categories-wrapper', (subCategoryHendler ? 'foodCatigoriesActive' : 'foodCatigoriesNotActive')]">
        <div :class="['food-categories']"
             v-if="subcategories.length">
            <div
                    class="food-categories-item"
                    v-for="item in subcategories"
                    :key="item._id"
                    :class="{ active: currentSubcategory === item._id }"
                    @click.prevent="getItems(item)" @click="foodMenuHendlerGhange"
            >
                <img
                        class="food-categories-item-img"
                        :src="item.sub_category_image"
                        :alt="dt(item)"
                />
                <div class="food-categories-item-text" :title="dt(item)">
                    {{ dt(item) }}
                </div>
                <div class="food-categories-item-check">
                    <i class="fa fa-check" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    </div>
    <!--add class bg if image not found => class="food-categories-item bg"-->
</template>

<script>
    import {mapState, mapActions, mapGetters} from 'vuex'

    export default {
        name: 'SubMenu',
        props: {},
        computed: {
            ...mapState({
                currentSubcategory: state => state.category.subcategory._id,
            }),
            ...mapGetters('category', ['subcategories']),
            ...mapGetters(['subCategoryHendler', 'foodMenuHendler']),
        },
        methods: {
            ...mapActions('category', ['getItems']),
            foodMenuHendlerGhange() {
                this.$store.dispatch('foodMenuHendlerGhange')
            }
        },
    }
</script>
<style lang="scss" scoped>
    @import '../../../../assets/scss/pixels_rem.scss';
    @import '../../../../assets/scss/variables.scss';
    @import '../../../../assets/scss/mixins.scss';

    @include responsive(mobile) {
        .food-categories-wrapper {
            grid-template-columns: 1fr;
            height: 100%;
            overflow: auto;
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            z-index: 2;
            background-color: transparent;
            &.foodCatigoriesActive{
                transition: 0.7s ease-out;
                top: 0;
            }
            &.foodCatigoriesNotActive{
                transition: 0.7s ease-out;
                top: -100%;
            }

            .food-categories {
                padding: 0;
                grid-gap: 0;
                overflow: auto;

                .food-categories-item {
                    display: grid;
                    align-items: center;
                    width: auto;
                    height: 50px;
                    border-radius: 0;
                    border: none;
                    padding: 0 20 0 0px;
                    min-height: 65px;
                    grid-template-columns: 50px 1fr;
                    grid-gap: 20px;
                    border-bottom: 1px solid $gray-middle;
                    background-color: #fafafa;

                    .food-categories-item-text {
                        font-size: 14px;
                        text-align: left;
                        font-weight: 600;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    img {
                        margin: 0;
                        width: 65px;
                        height: 65px;
                    }

                    .food-categories-item-check {
                        display: none;
                    }

                    &.active {
                        box-shadow: none;

                        .food-categories-item-check {
                            display: none;
                        }
                    }
                }
            }
        }
    }
</style>
