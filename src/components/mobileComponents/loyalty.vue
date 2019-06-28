<template>
    <div :class="['loyalty', {active: loyaltyHendler}]">
        <search-loyalty-customer/>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex'
    import searchLoyaltyCustomer from '../pos/footer/popups/SearchLoyaltyCustomer'

    export default {
        name: "loyalty",
        components: {
            searchLoyaltyCustomer
        },
        computed: {
            ...mapGetters(['loyaltyHendler'])
        }
    }
</script>

<style lang="scss">
    @import '../../assets/scss/pixels_rem.scss';
    @import '../../assets/scss/variables.scss';
    @import '../../assets/scss/mixins.scss';

    @include responsive(mobile) {
        #search-loyalty-customer {
            display: none !important;
        }
    }

    .loyalty {
        position: fixed;
        width: 100vw;
        top: 0;
        right: -100vw;
        bottom: 0;
        z-index: 1060;
        background-color: #fff;
        transition: 0.5s ease-out;
        box-shadow: 0 0 30px rgba(0,0,0,0.1);

        &.active {
            right: 0;
        }

        #search-loyalty-customer {
            display: block !important;
            opacity: 1;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            .modal-dialog {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                height: auto;
                min-height: auto;
                margin: 0;
                transform: none;

                .modal-content {
                    .modal-header {
                        display: none;
                    }

                    .modal-body {
                        .add-note-area {
                            p {
                                margin: 0;
                                margin-bottom: 20px;
                                font-size: 16px;
                            }

                            input {
                                height: 50px;
                                padding: 0 20px;
                                margin-bottom: 20px;
                            }

                            button {
                                padding: 0 35px;
                                height: 50px;
                            }
                        }
                    }

                    .modal-footer {
                        .btn-announce {
                            button {
                                height: 50px;
                                padding: 0 35px;
                                border-radius: $btn-border-radius;
                                margin-left: 10px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>