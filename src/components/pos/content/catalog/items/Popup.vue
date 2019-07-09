<template>
    <!-- Modal -->
    <div
            class="modal fade POSItemOptions catalog-popup"
            id="POSItemOptions"
            tabindex="-1"
            role="dialog"
            aria-labelledby="POSItemOptions"
            aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <Header/>
                <Content/>
                <div class="error" v-show="error">{{ error }}</div>
                <Footer/>
            </div>
        </div>
    </div>
    <!-- End Model -->
</template>

<script>
    import {mapState} from 'vuex'
    import Content from './popup/Content'
    import Header from './popup/Header'
    import Footer from './popup/Footer'

    export default {
        name: 'Popup',
        props: {},
        components: {
            Content,
            Header,
            Footer,
        },
        computed: {
            ...mapState('orderForm', ['error']),
        },
    }
</script>
<style lang="scss">
    @import '../../../../../assets/scss/pixels_rem.scss';
    @import '../../../../../assets/scss/variables.scss';
    @import '../../../../../assets/scss/mixins.scss';

    @include responsive(mobile) {
        .POSItemOptions {
            .modal-footer {
                .buttoned {
                    width: auto;
                    height: 50px;
                    padding: 0 25px !important;
                    img{
                        margin-right: 10px;
                    }
                }
            }
        }
    }
</style>
