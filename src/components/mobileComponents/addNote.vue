<template>
  <div :class="['add-note', { active: addNoteHendler }]">
    <add-note v-if="false" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import addNote from '../pos/footer/popups/AddNote.vue'

export default {
  components: {
    addNote,
  },
  computed: {
    ...mapGetters(['addNoteHendler']),
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';

@include responsive(mobile) {
  .add-note {
    #add-note {
      display: none !important;
      background-color: transparent;

      .modal-dialog {
        background-color: transparent;

        .modal-content {
          background-color: transparent;

          .modal-body {
            .add-note-area {
              textarea {
                outline: none;
                padding: 10px 10px;
              }
            }
          }
          .modal-footer {
            .btn-announce {
              button {
                height: 50px;
              }
            }
          }
        }
      }
    }
  }
}

.add-note {
  position: fixed;
  width: 100vw;
  top: 0;
  right: -100vw;
  bottom: 0;
  z-index: 1060;
  background-color: #fff;
  transition: 0.5s ease-out;
  border-left: 1px solid #ddd;

  &.active {
    right: 0;
  }

  #add-note {
    position: absolute;
    display: block !important;
    opacity: 1;

    .modal-dialog {
      display: block;
      max-width: 100%;
      transform: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      .modal-content {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        .modal-header {
          padding: 20px;
        }

        .modal-body {
          padding: 0 20px;
        }
      }
    }
  }
}
</style>
