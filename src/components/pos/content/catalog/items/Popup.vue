<template>
  <!-- Modal -->
  <div
    class="modal fade POSItemOptions"
    id="POSItemOptions"
    tabindex="-1"
    role="dialog"
    aria-labelledby="POSItemOptions"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content color-dashboard-background">
        <Header />
        <HeaderDetails />
        <Content />
        <Footer />
      </div>
    </div>
  </div>
  <!-- End Model -->
</template>

<script>
import Header from './popup/Header'
import HeaderDetails from './popup/header/HeaderDetails'
import Content from './popup/Content'
import Footer from './popup/Footer'

export default {
  name: 'Popup',
  props: {},
  components: {
    Content,
    Header,
    HeaderDetails,
    Footer,
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
