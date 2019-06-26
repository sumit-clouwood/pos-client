<template>
    <!-- Add Note -->
    <div class="modal fade" id="add-note" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header customer-header">
                    <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
                    <h4 class="customer-title">{{ _t('+ Add') + ' ' + _t('Note') }}</h4>
                </div>
                <div class="modal-body add-note-wrap">
                    <div class="add-note-area">
                        <p>{{ _t('+ Add') }} {{ _t('Order') }} {{ _t('Note') }}</p>
                        <textarea
                                type="text"
                                class="add-note-form"
                                v-model="orderNote"
                        ></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="btn-announce">
                        <button
                                type="button"
                                class="btn btn-danger cancel-announce"
                                data-dismiss="modal"
                        >
                            {{ _t('Cancel') }}
                        </button>
                        <button
                                @click="addNoteOrder(orderNote)"
                                class="btn btn-success btn-large"
                                type="button"
                                id="save-note"
                        >
                            {{ _t('Save') }}
                        </button>
                    </div>
                    <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
                </div>
            </div>
        </div>
    </div>

    <!-- Add note -->
    <!-- ====================================== -->
</template>

<script>
    /* global $ */
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: 'AddNote',
        props: {},
        data() {
            return {
                orderNote: '',
            }
        },
        computed: {
            ...mapGetters('location', ['_t']),
        },
        methods: {
            addNoteOrder: function (orderNote) {
                this.addOrderNote(orderNote)
                $('#add-note').modal('toggle')
            },
            ...mapActions('order', ['addOrderNote']),
        },
    }
</script>
