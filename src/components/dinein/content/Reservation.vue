<template>
  <div>
    <div
      v-if="tablesOnArea && dineInTabType === 'reservation'"
      class="table-holder container-fluid running-orders-dinein active"
      id="all-tables-show"
      style="display: block; padding-right: 0;"
    >
      <div class="fixed-reservation">
        <div class="pos-reservation-header">
          <div class="reservation-date-format">
            <input type="hidden" id="selectedDates" value="" />
            <span id="wtf"></span>
            <div id="page" class="page">
              <section id="main">
                <div class="wrapperHor"></div>
              </section>
            </div>
          </div>
        </div>
        <div class="pos-reservation-table" v-if="newDetails">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>{{ _t('Customer') }}</th>
                <th>{{ _t('Time') }}</th>
                <th>{{ _t('Area/Table') }}</th>
                <th>{{ _t('Guests') }}</th>
                <th></th>
              </tr>
            </thead>
            <!--<tbody v-if="!reservations">
              <tr>
                <td colspan="5">
                  <Preloader />
                </td>
              </tr>
            </tbody>-->
            <tbody>
              <tr v-for="(reservation, index) in reservations" :key="index">
                <td class="text-capitalize">
                  {{ customerName(reservation) }}
                </td>
                <td>
                  <!--{{ reservation.start_date }},-->
                  {{ DateTime.convertTime24to12(reservation.start_time) }}
                </td>
                <td>
                  {{ getAreaName(reservation.assigned_table_id) }} /
                  {{ reservation.number }}
                </td>
                <td>
                  <span class="fa fa-user"></span>&nbsp;{{
                    reservation.number_of_guests
                  }}
                </td>
                <td class="mr-1 reservation-actions">
                  <button
                    class="btn btn-success"
                    @click="
                      editReservation({
                        id: reservation.assigned_table_id,
                        popup: false,
                        reservationId: reservation._id,
                      })
                    "
                  >
                    <span class="fa fa-check"></span>
                  </button>
                  <button
                    class="btn btn-warning"
                    @click="
                      editReservation({
                        id: reservation.assigned_table_id,
                        popup: true,
                        reservationId: reservation._id,
                      })
                    "
                  >
                    <span class="fa fa-edit"></span>
                  </button>
                  <button
                    class="btn btn-danger"
                    @click="cancelReservation(reservation._id)"
                  >
                    <span class="dlt-icon">
                      <img src="img/pos/delete-icon-reservation.svg" />
                    </span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pos-reservation-table" v-else>
          {{ _t('No reservations found') }}
        </div>
        <div class="pos-reservation-footer">
          <button
            class="btn btn-success"
            data-toggle="modal"
            @click="newReservation"
          >
            {{ _t('New Reservation') }}
          </button>
        </div>
      </div>
      <TableDraw />
      <NewReservation
        :dateSelector="newDtPicker"
        :reservationInformation="selectedReservation"
        :edit="editStatus"
      />
      <div
        class="modal"
        id="confirmReservation"
        style="display: none; z-index: 1050;"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header customer-header">
              <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
              <h4 class="customer-title">{{ _t('Confirmation!') }}</h4>
            </div>
            <div class="modal-body font-weight-bold" id="confirmMessage">
              {{ cancelReservationMsg }}
            </div>
            <div class="modal-footer modal-footer-reservation">
              <button
                type="button"
                id="confirm"
                class="btn btn-success"
                data-dismiss="modal"
                @click="confirmCancelReservation()"
              >
                {{ _t('Ok') }}
              </button>
              <button type="button" class="btn btn-danger" data-dismiss="modal">
                {{ _t('Close') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination-customer-details">
      <!--<paginate
            v-if="totalReservations.totalPages"
            :page-count="totalReservations.totalPages"
            :page-range="2"
            :margin-pages="2"
            :clickHandler="fetchMore"
            :prev-text="_t('Prev')"
            :next-text="_t('Next')"
            :container-class="''"
            :page-class="_t('page-item')"
            v-model="page"
          ></paginate>-->
    </div>
    <!--    <InformationPopup :responseInformation="msg" title="Alert" />-->
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import TableDraw from '../content/TableDraw'
import NewReservation from './reservation/popup/NewReservation'
// import Preloader from '@/components/util/Preloader'
// import paginate from 'vuejs-paginate'
// import InformationPopup from '@/components/pos/content/InformationPopup'
/* global $ */
export default {
  name: 'Reservation',
  components: {
    TableDraw,
    NewReservation,
    // Preloader,
    // paginate,
    // InformationPopup,
  },
  computed: {
    ...mapState('dinein', ['tablesOnArea', 'dineInTabType', 'availableTables']),
    ...mapGetters('location', ['_t']),
    ...mapState('dineinReservation', ['reservations', 'selectedReservation']),
  },
  data() {
    return {
      editStatus: false,
      newDtPicker: false,
      calendarOpen: false,
      newDetails: false,
      selectedDate: '',
      msg: '',
      selectedReservationId: '',
      cancelReservationMsg: 'Do you want to cancel this reservation?',
    }
  },
  updated() {
    let isCalendarhasData = $('.wrapperHor').text().length
    if (isCalendarhasData == 0 && this.dineInTabType == 'reservation')
      this.cal()
  },
  methods: {
    customerName(reservation) {
      return reservation.guest_fname.length
        ? reservation.guest_fname + ' ' + (reservation.guest_lname || '')
        : 'Anonymous'
    },
    newReservation() {
      this.editStatus = false
      this.newDtPicker = true
      let selectedReservation = {
        status: 'booked',
        customers: [],
        number_of_guests: 1,
      }
      this.$store.commit(
        'dineinReservation/SELECTED_RESERVATION',
        selectedReservation
      )
      this.$store.commit('dineinReservation/USER_HISTORY', false)
      $('#NewReservation').modal('show')
      /*let obj = new Date()
      let day = obj.getDay() + 1
      $('.SCDayNum:contains(' + day + ')').click()*/
    },
    cancelReservation(id) {
      this.cancelReservationMsg = 'Do you want to cancel this reservation?'
      $('#confirmReservation').modal('show')
      this.selectedReservationId = id
    },
    editReservation(data) {
      let id = data.id
      let popup = data.popup
      this.selectedReservationId = data.reservationId
      this.editStatus = this.editStatus ? false : true
      let getReservation = this.reservations.find(
        reservation => reservation['_id'] == this.selectedReservationId
      )
      if (popup) {
        this.editStatus = popup
        this.newDtPicker = true
        this.$store.dispatch(
          'dineinReservation/getUserHistory',
          getReservation.guest_phone
        )
        this.$store.commit(
          'dineinReservation/SELECTED_RESERVATION',
          getReservation
        )
        $('#NewReservation').modal('show')
      } else {
        let data = {
          assigned_table_id: id,
          customers: [],
          number_of_guests: getReservation.number_of_guests,
          start_date: getReservation.start_date,
          start_time: getReservation.start_time,
          status: 'reserved',
        }
        this.$store
          .dispatch('dineinReservation/editTable', {
            data: data,
            id: getReservation._id,
          })
          .then(() => {
            // alert('success')
          })
      }
    },

    confirmCancelReservation() {
      this.reservationUpdateStatus({
        reservationId: this.selectedReservationId,
        status: 'cancelled_reservation',
      }).then(response => {
        if (response.status === 'form_errors') {
          this.cancelReservationMsg = response.form_errors.status[0]
          $('#confirmReservation').modal('show')
          return false
        }
        this.getReservationByDate(this.selectedDate)
        /*this.$store.dispatch('dinein/updateDineInOrderStatus', {
          title: 'all',
          pageId: 'getBookedTables',
          loader: false,
        })*/
        this.$store
          .dispatch('dinein/updateDineInOrderStatus', {
            title: 'reservation',
            pageId: 'getBookedTables',
            loader: false,
          })
          .then(() => {
            this.$store.dispatch('dinein/getDineInArea', false)
            this.$store.dispatch('dinein/getDineInTables', false)
          })
        // this.$store.dispatch('dinein/getBookedTables', false)
      })
    },

    getAreaName: function(tableId) {
      return this.availableTables.find(table => table.table_id === tableId).name
    },

    cal: function() {
      let scope = this
      $('.wrapperHor').SC({
        selectedDatesObj: 'selectedDates',
        animate: true,
        useWheel: true,
        vertical: false,
        sizes: 'auto',
        callbackDelay: 50,
        years: 1,
        months: 3,
        days: 3,
        invert: false,
        combineMonthYear: true,
        showDayArrows: true,
        showDayNames: true,
        monthNames: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        doubleDigitsDays: true,
        allowSelectSpans: true,
        callback: function(cal) {
          $('.SCToday')
            .parent()
            .parent()
            .prevAll()
            .find('.SCElement')
            .parent()
            .parent()
            .addClass('disabled')
          scope.selectedDate = cal.currentDate
          scope.calendarOpen = true
          scope.getReservationByDate(cal.currentDate)

          // below section for change another calendar date according to this
          let getUTC = scope.$store.getters['dineinReservation/getUTCDate'](
            cal.currentDate
          ).split('-')
          let getDay = getUTC[2] || false
          if (getDay) $('.SCDayNum:contains(' + getDay + ')').click()
        },
      })
    },
    getReservationByDate: function(date) {
      let scope = this
      this.$store
        .dispatch('dineinReservation/getReservationByDate', date)
        .then(details => {
          scope.newDetails = details
        })
        .catch(details => {
          scope.newDetails = details
        })
    },
    ...mapActions('dinein', ['reservationUpdateStatus']),
  },
}
</script>

<style scoped></style>
