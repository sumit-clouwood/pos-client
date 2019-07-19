<template>
    <div class="mobile-page">
        <div class="mobile-header">
            <div class="current-sale">
                <div class="title">Current Sale</div>
                <div class="list">
                    <div class="items" v-for="(item, key) in itemFood" :key="key">
                        <div class="items-text">{{item.name}}</div>
                        <div class="items-num">x{{item.count}}</div>
                    </div>
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
        <div class="mobile-search">
            <search/>
        </div>
        <div class="mobile-body">
            <posmenu/>
            <submenu/>
            <items/>
        </div>
        <mobile-footer/>
    </div>
</template>
<script>
    import {mapActions, mapState, mapGetters} from "vuex";
    import search from '../pos/content/catalog/Search.vue'
    import submenu from '../pos/content/catalog/SubMenu.vue'
    import posmenu from '../pos/Menu.vue'
    import items from '../pos/content/catalog/Items.vue'
    import mobileFooter from './mobileFooter.vue'

    export default {
        components: {
            search,
            posmenu,
            submenu,
            items,
            mobileFooter,
        },
        computed: {
            ...mapGetters('category', ['subcategories', 'items']),
            ...mapGetters(['footerButtonHendler', 'footerMenuHendler', 'itemFood']),
        },
        methods: {
            profileHendlerGhange() {
                this.$store.dispatch('profileHendlerGhange')
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

        .mobile-header {
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

                .list {
                    display: flex;
                    width: 70vw;
                    overflow: auto;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                    &::-webkit-scrollbar {
                        width: 0;
                        height: 0;
                    }

                    .items {
                        display: grid;
                        grid-template-columns: max-content max-content;
                        align-items: center;
                        margin-right: 10px;

                        .items-text {
                            margin-right: 10px;
                            height: 25px;
                            display: flex;
                            align-items: center;
                        }

                        .items-num {
                            min-width: 20px;
                            min-height: 20px;
                            background-color: $green-middle;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #fff;
                            font-weight: 600;
                            border-radius: $btn-border-radius;
                            font-size: 12px;
                            padding: 3px 5px;
                        }
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

        .mobile-search {
            border-top: 1px solid #E3E7F2;
            padding: 10px 0;
        }

        .mobile-body {
            border-top: 1px solid #E3E7F2;
            border-bottom: 1px solid #E3E7F2;
            overflow: hidden;
            position: relative;
            background-color: #fafafa;
        }

        .mobile-footer {
            .btn-next {
                display: none;
            }
        }
    }
</style>