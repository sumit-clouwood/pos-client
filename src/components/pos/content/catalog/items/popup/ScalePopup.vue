<template>
  <div class="modal fade" id="scale-popup" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content color-dashboard-background">
        <div class="modal-header customer-header color-secondary">
          <h4 class="customer-title color-text-invert">
            {{ _t('Item') }} {{ _t('Measurement') }}
          </h4>
        </div>
        <form class="modal-body add-note-wrap" autocomplete="off">
          <p class="color-text-invert">{{ _t('Enter Measurement Unit') }}</p>
          <div class="add-note-area <!--loyalty-search-->">
            <input
              autocomplete="off"
              type="text"
              :placeholder="_t('Measurement')"
              class="inputSearch"
              v-model="measurement"
            />
          </div>
          <span
            class="loyalty-error text-danger loyalty-customer-error color-warning"
          >
            {{ error }}
          </span>
        </form>
        <div class="modal-footer">
          <div class="btn-announce">
            <div class="btn-loyalty">
              <button
                class="btn btn-success btn-large color-text-invert color-main"
                type="button"
                id="save-note"
              >
                {{ _t('Select') }}
              </button>
              <button
                type="button"
                class="btn btn-danger cancel-announce color-text-invert color-button"
                data-dismiss="modal"
              >
                {{ _t('Cancel') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ScalePopup',
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>
<!-- eslint-disable max-len -->
<style scoped lang="scss">
@import '@/assets/scss/pixels_rem.scss';
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
.dropdown {
  position: relative;
}

.inputSearch {
  padding-bottom: 11px;
  height: 48px;
  border-radius: 5px 0px 0px 5px;
}

.btnSuccess {
  color: #fff;
  height: 47px;
  height: 3.125rem;
  border-radius: 0px 5px 5px 0px;
}
.cancel-announce,
#save-note {
  height: 3.125rem;
}

.dropdown span:hover {
  background-color: #ddd;
}

.cursor-pointer {
  margin-right: 1.5rem;
  font-size: 1rem;
}

@include responsive(mobile) {
  .cancel-announce,
  .cursor-pointer,
  #save-note {
    font-size: 1rem !important;
  }
  .btn-loyalty {
    display: grid;
    grid-template-columns: repeat(2, 1fr) !important;
    column-gap: 0.5rem;
  }
}
</style>
