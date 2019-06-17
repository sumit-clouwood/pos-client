<template>
    <div class="mobile-page">
        <div class="mobile-page-header">
            <div class="current-sale">
                <div class="title">Current Sale</div>
                <div class="items">
                    <div class="items-text">Items</div>
                    <div class="items-num">x3</div>
                </div>
            </div>
            <div class="btn-menu" @click="profileHendlerGhange">
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M0 5C0 4.44772 0.447715 4 1 4H19C19.5523 4 20 4.44772 20 5C20 5.55228 19.5523 6 19 6H1C0.447715 6 0 5.55228 0 5Z"
                          fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M0 1C0 0.447715 0.447715 0 1 0H19C19.5523 0 20 0.447715 20 1C20 1.55228 19.5523 2 19 2H1C0.447715 2 0 1.55228 0 1Z"
                          fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M0 9C0 8.44771 0.447715 8 1 8H19C19.5523 8 20 8.44771 20 9C20 9.55229 19.5523 10 19 10H1C0.447715 10 0 9.55229 0 9Z"
                          fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M0 13C0 12.4477 0.447715 12 1 12H19C19.5523 12 20 12.4477 20 13C20 13.5523 19.5523 14 19 14H1C0.447715 14 0 13.5523 0 13Z"
                          fill="white"/>
                </svg>
            </div>
        </div>
        <div class="mobile-page-search">
            <search/>
        </div>
        <div class="mobile-page-body">
            <posmenu/>
            <submenu/>
            <items/>
        </div>
        <div class="mobile-page-footer">
            <div class="btn-cart" @click="mainOrdersHendlerGhange">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.99999 16C6.46956 16 5.96085 15.7893 5.58578 15.4142C5.21071 15.0391 4.99999 14.5304 4.99999 14C4.99999 13.4696 5.21071 12.9609 5.58578 12.5858C5.96085 12.2107 6.46956 12 6.99999 12C7.53043 12 8.03913 12.2107 8.41421 12.5858C8.78928 12.9609 8.99999 13.4696 8.99999 14C8.99999 14.5304 8.78928 15.0391 8.41421 15.4142C8.03913 15.7893 7.53043 16 6.99999 16ZM14 16C13.4696 16 12.9609 15.7893 12.5858 15.4142C12.2107 15.0391 12 14.5304 12 14C12 13.4696 12.2107 12.9609 12.5858 12.5858C12.9609 12.2107 13.4696 12 14 12C14.5304 12 15.0391 12.2107 15.4142 12.5858C15.7893 12.9609 16 13.4696 16 14C16 14.5304 15.7893 15.0391 15.4142 15.4142C15.0391 15.7893 14.5304 16 14 16ZM0.961994 1.923C0.712355 1.91495 0.475635 1.81012 0.301892 1.63068C0.128149 1.45125 0.0310059 1.21127 0.0310059 0.9615C0.0310059 0.711732 0.128149 0.471755 0.301892 0.292318C0.475635 0.11288 0.712355 0.00805181 0.961994 0L2.11299 0C3.01499 0 3.79499 0.626 3.99099 1.506L5.24399 7.148C5.43999 8.028 6.21999 8.654 7.12199 8.654H14.634L16.076 2.884H6.73099C6.4837 2.87272 6.25028 2.76654 6.07928 2.58755C5.90827 2.40857 5.81285 2.17055 5.81285 1.923C5.81285 1.67545 5.90827 1.43743 6.07928 1.25845C6.25028 1.07946 6.4837 0.973284 6.73099 0.962H16.076C16.3683 0.961914 16.6568 1.02848 16.9196 1.15663C17.1823 1.28479 17.4124 1.47116 17.5923 1.70158C17.7722 1.93201 17.8972 2.20041 17.9578 2.4864C18.0184 2.77238 18.013 3.06842 17.942 3.352L16.5 9.12C16.396 9.5362 16.1559 9.90568 15.8178 10.1697C15.4797 10.4337 15.063 10.5771 14.634 10.577H7.12199C6.24679 10.5771 5.39772 10.2787 4.71501 9.7311C4.0323 9.18348 3.55678 8.41938 3.36699 7.565L2.11299 1.923H0.961994Z"
                          fill="white"/>
                </svg>
                <div class="text">Cart</div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapActions, mapState, mapGetters} from "vuex";
    import search from '../pos/content/catalog/Search.vue'
    import submenu from '../pos/content/catalog/SubMenu.vue'
    import posmenu from '../pos/Menu.vue'
    import items from '../pos/content/catalog/Items.vue'

    export default {
        components: {
            search,
            posmenu,
            submenu,
            items,
        },
        computed: {
            ...mapGetters('category', ['subcategories', 'items']),
            ...mapGetters(['footerButtonHendler', 'footerMenuHendler']),
        },
        methods: {
            profileHendlerGhange() {
                this.$store.dispatch('profileHendlerGhange')
            },
            mainOrdersHendlerGhange() {
                this.$store.dispatch('mainOrdersHendlerGhange')
                this.$store.dispatch('footerButtonHendlerGhange')
            },
            footerMenuHendlerGhange() {
                this.$store.dispatch('footerMenuHendlerGhange')
            }
        }
    }
</script>
<style lang="scss">
    @import '../../assets/scss/pixels_rem.scss';
    @import '../../assets/scss/variables.scss';
    @import '../../assets/scss/mixins.scss';

    .mobile-page {
        background-color: #fff;
        height: 100%;
        display: grid;
        grid-template-rows: 100px 55px 1fr 75px;

        .mobile-page-header {
            padding: 0 20px;
            display: grid;
            grid-template-columns: 1fr max-content;
            align-items: center;
            background-color: #fafafa;

            .current-sale {
                .title {
                    font-size: 24px;
                    line-height: 27px;
                    font-weight: 600;
                    margin-bottom: 5px;
                }

                .items {
                    display: grid;
                    grid-template-columns: max-content max-content;

                    .items-text {
                        margin-right: 10px;
                    }

                    .items-num {
                        width: 25px;
                        height: 25px;
                        background-color: $green-middle;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #fff;
                        font-weight: 600;
                        border-radius: $btn-border-radius;
                    }
                }
            }

            .btn-menu {
                width: 50px;
                height: 50px;
                background-color: $btn-bg-black;
                border-radius: $btn-border-radius;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .mobile-page-search {
            border-top: 1px solid #E3E7F2;
            padding: 10px 0;
        }

        .mobile-page-body {
            border-top: 1px solid #E3E7F2;
            border-bottom: 1px solid #E3E7F2;
            overflow: hidden;
            position: relative;
            background-color: #fafafa;
        }

        .mobile-page-footer {
            padding: 0 20px;
            display: flex;
            align-items: center;

            .btn-cart {
                width: 100%;
                height: 50px;
                color: #fff;
                display: grid;
                grid-template-columns: 1fr 1fr;
                align-items: center;
                background-color: $green-middle;
                letter-spacing: 1px;
                border-radius: $btn-border-radius;
                padding: 0 25px;

                .text {
                    margin-left: -13px;
                }
            }
        }
    }
</style>