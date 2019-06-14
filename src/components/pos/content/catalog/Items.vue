<template>
    <div :class="['food-menu', (foodMenuHendler ? 'active' : 'notActive')]">
        <div class="food-menu-wrapper">
            <div
                    class="food-menu-item"
                    v-for="item in items"
                    :key="item._id"
                    @click.prevent="addToOrder(item)"
            >
                <img
                        class="food-menu-item-img"
                        :src="item.image"
                        :alt="dt(item)"
                        @error="imageLoadError()"
                />
                <div class="food-menu-item-text">{{ dt(item) }}</div>
                <div class="food-menu-item-price">AED 12.81</div>
            </div>
            <Popup/>
        </div>
    </div>
</template>

<script>
    /* global $, showModal  */

    import {mapGetters} from 'vuex'

    import Popup from './items/Popup'

    export default {
        name: 'Items',
        props: {
            msg: String,
        },
        components: {
            Popup,
        },
        computed: {
            ...mapGetters('category', ['items']),
            ...mapGetters('modifier', ['hasModifiers']),
            ...mapGetters(['foodMenuHendler']),
        },
        methods: {
            addToOrder(item) {
                this.$store.commit('category/SET_ITEM', item)
                this.$store.commit('checkoutForm/showCalc', true)
                if (this.$store.getters['modifier/hasModifiers'](item)) {
                    this.$store.dispatch('modifier/assignModifiersToItem', item)
                    this.$store.commit('orderForm/clearSelection')
                    showModal('#POSItemOptions')
                } else {
                    this.$store.dispatch('order/addToOrder', item)
                }
            },
            IsImageOk(img) {
                // During the onload event, IE correctly identifies any images that
                // weren't downloaded as not complete. Others should too. Gecko-based
                // browsers act like NS4 in that they report this incorrectly.
                if (!img.complete) {
                    return false
                }

                // However, they do have two very useful properties: naturalWidth and
                // naturalHeight. These give the true size of the image. If it failed
                // to load, either of these should be zero.
                if (typeof img.naturalWidth != 'undefined' && img.naturalWidth == 0) {
                    return false
                }

                // No other way of checking: assume it's ok.
                return true
            },

            imageLoadError() {
                // let myDoc = document.getElementsByClassName('.contain-body-class')
                /* myDoc = myDoc.remove('.sticky-footer')*/
                for (let i = 0; i < document.images.length; i++) {
                    if (!this.IsImageOk(document.images[i])) {
                        let hue =
                            'rgb(' +
                            (Math.floor((256 - 199) * Math.random()) + 200) +
                            ',' +
                            (Math.floor((256 - 199) * Math.random()) + 200) +
                            ',' +
                            (Math.floor((256 - 199) * Math.random()) + 200) +
                            ')'
                        $(document.images[i])
                            .closest('div.pos-item-bg')
                            .css('background-color', hue)
                        $(document.images[i])
                            .siblings('p')
                            .css('font-size', '15px')
                        $(document.images[i])
                            .closest('div.pos-size-bg')
                            .css('background-color', hue)
                        $(document.images[i])
                            .siblings('span')
                            .css('font-weight', 'bold')
                        document.images[i].remove()
                    }
                }
            },
        },
    }
</script>
<style lang="scss" scoped>
    @import '../../../../assets/scss/pixels_rem.scss';
    @import '../../../../assets/scss/variables.scss';
    @import '../../../../assets/scss/mixins.scss';

    .pos-item-bg {
        img {
            max-width: 146px;
        }
    }

    @include responsive(mobile) {
        .food-menu {
            height: 100%;
            padding: 0;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: auto;
            background-color: transparent;

            &.active {
                top: 0;
                transition: 0.7s ease-out;
            }

            &.notActive {
                top: -100%;
                transition: 0.7s ease-out;
            }

            .food-menu-wrapper {
                padding: 0;
                height: auto;
            }

            .food-menu-item {
                width: 100%;
                height: auto;
                padding: 0;
                margin: 0;
                display: grid;
                align-items: center;
                grid-template-columns: auto 1fr max-content;
                grid-gap: 20px;
                border-radius: 0;
                border: none;
                border-bottom: 1px solid $gray-middle;
                padding-right: 20px;
                background-color: #fafafa;

                img {
                    width: 60px;
                    height: 60px;
                }

                .food-menu-item-text {
                    text-align: left;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .food-menu-item-price {
                    display: block;
                    color: $green-middle;
                    font-weight: 600;
                }
            }
        }
    }


</style>
