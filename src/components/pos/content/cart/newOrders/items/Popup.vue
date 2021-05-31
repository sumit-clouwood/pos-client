<template>
  <!-- Modal -->
  <div
    class="modal fade order-item-modal POSItemOptions"
    id="POSOrderItemOptions"
    tabindex="-1"
    role="dialog"
    aria-labelledby="POSOrderItemOptions"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content color-dashboard-background">
        <Header />
        <Content />
        <div class="text-danger pl-30 color-warning" v-show="error">
          {{ error }}
        </div>
        <Footer />
      </div>
    </div>
  </div>
  <!-- End Model -->
</template>

<script>
/* global $ */
import { bus } from '@/eventBus'
import Header from './popup/Header.vue'
import Content from '@/components/pos/content/catalog/items/popup/Content.vue'
import Footer from './popup/Footer.vue'
import { mapState } from 'vuex'

export default {
  name: 'Popup',
  props: {},
  data() {
    return {
      modifierBlockHeight: 0,
      modifierBlockInitHeight: 0,
      modifierBlockItemHeight: 0,
    }
  },
  components: {
    Content,
    Header,
    Footer,
  },
  computed: {
    ...mapState('orderForm', ['error']),
  },
  mounted() {
    bus.$on('modifier-heights', () => {
      setTimeout(() => {
        if ($('#POSOrderItemOptions').hasClass('show')) {
          this.modifierScroll()
        }
      }, 300)
    })
  },
  methods: {
    modifierScroll() {
      let modifierBlockHeight = $(
        '#POSOrderItemOptions .positemoption_body'
      ).innerHeight()
      this.modifierBlockHeight = modifierBlockHeight
      this.modifierBlockInitHeight = modifierBlockHeight
      this.modifierBlockItemHeight = $(
        '#POSOrderItemOptions .positemoption-wrapper'
      ).innerHeight()
      $('.modifier-bottom-arrow, .modifier-top-arrow').removeClass('disable')
      if (this.modifierBlockHeight > this.modifierBlockItemHeight) {
        $('.modifier-bottom-arrow, .modifier-top-arrow').addClass('disable')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixins.scss';
/*#POSOrderItemOptions {
  .modal {
    .modal-dialog {
      .modal-content {
        .modal-footer {
          padding: 0 1.875rem 1.875rem 0.875rem;
        }
      }
    }
  }
}*/
.POSItemOptions {
  .modal-body {
    height: auto !important;
    max-height: 460px;
  }
  .modal-content {
    @include responsive(mobile) {
      max-height: 70vh !important;
      overflow: auto !important;
    }
  }
}
</style>
