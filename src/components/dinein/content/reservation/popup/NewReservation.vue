<template>
  <div class="modal fade" id="NewReservation">
    <div class="modal-dialog" style="max-width: 80%">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Make a reservation</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>Select Number of guests</label>
                <div
                  class="btn-group btn-group-toggle num_guests"
                  data-toggle="buttons"
                >
                  <label
                    v-for="(n, i) in 8"
                    :key="n"
                    :class="[
                      'btn',
                      'btn-secondary',
                      { active: no_of_guest === n },
                    ]"
                  >
                    <input
                      type="radio"
                      name="options"
                      :id="'option' + i"
                      autocomplete="off"
                    />
                    {{ i + 1 }} {{ n === 8 ? '+' : '' }}
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label>Select Date</label>
                <div class="row">
                  <div class="select_date">
                    <div>
                      <!--<datetime
                        type="datetime"
                        title="Schedule"
                        placeholder="Schedule"
                        v-model="futureDateTime"
                        input-class="btn schedule-input btn-large datepicker-here color-dashboard-background"
                        :value-zone="timeZone"
                        :zone="timeZone"
                        :format="{
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        }"
                        :phrases="{ ok: 'Continue', cancel: 'Exit' }"
                        :hour-step="1"
                        :minute-step="10"
                        :min-datetime="minDatetime"
                        :max-datetime="maxDatetime"
                        :week-start="7"
                        use12-hour
                        auto
                      ></datetime>-->
                    </div>
                    <div class="arrow" @click="prev_week">
                      &lt;
                    </div>
                    <div v-for="(val, key) in days" :key="key">
                      <span>{{ val.day }}</span>
                      <span>{{ val.date }}</span>
                    </div>
                    <div class="arrow" @click="next_week">
                      &gt;
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Time slot available</label>
                <div class="row time_slot_block" style="margin: 0">
                  <div
                    v-for="(val, key) in time_slots"
                    :key="key"
                    class="col-sm-3 time_slot"
                  >
                    <div
                      :class="['is_available', { not_available: val.occupied }]"
                    >
                      -
                    </div>
                    <div>{{ val.time }}</div>
                    <div>am</div>
                  </div>
                </div>
              </div>
              <label>Table Assignment</label>
              <div class="row">
                <div class="col-md-6">
                  <button
                    type="button"
                    class="btn btn-secondary btn-lg btn-block"
                  >
                    Select View
                  </button>
                </div>
                <div class="col-md-6">
                  <button
                    type="button"
                    class="btn btn-secondary btn-lg btn-block"
                  >
                    Select Table
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Phone</label>
                    <input type="email" class="form-control" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>First Name</label>
                    <input type="text" class="form-control" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" class="form-control" />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <label>Guest History</label>
                  <table class="table table-bordered">
                    <tbody>
                      <tr>
                        <th scope="row">Thu, Sept 16</th>
                        <td>11:45 am</td>
                        <td>Nearly Finished</td>
                        <td>Victoria Pope Daniel</td>
                      </tr>
                      <tr>
                        <th scope="row">Thu, Sept 16</th>
                        <td>11:45 am</td>
                        <td>Finished</td>
                        <td>Victoria Pope Daniel</td>
                      </tr>
                      <tr>
                        <th scope="row">Thu, Sept 16</th>
                        <td>11:45 am</td>
                        <td>Finished</td>
                        <td>Victoria Pope Daniel</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-md-12">
                  <label style="margin-top: 10px">Tags</label>
                  <div style="display: block">
                    <span class="badge badge-secondary active">VIP</span>
                    <span class="badge badge-secondary active">Birthday</span>
                    <span class="badge badge-secondary">Anniversary</span>
                    <span class="badge badge-secondary">Private Dining</span>
                    <span class="badge badge-secondary">First Time</span>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group" style="margin-top: 10px">
                    <label>Visit Notes</label>
                    <textarea class="form-control" rows="3"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">
            Cancel
          </button>
          <button type="button" class="btn btn-success">Add Reservation</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import moment from 'moment-timezone'
// import { Datetime } from 'vue-datetime'

export default {
  name: 'NewReservation',
  components: {
    // Datetime,
  },
  data() {
    return {
      no_of_guest: 5,
      time_slots: [
        {
          occupied: true,
          time: '0800',
        },
        {
          occupied: null,
          time: '0815',
        },
        {
          occupied: null,
          time: '0830',
        },
        {
          occupied: null,
          time: '0845',
        },
        {
          occupied: null,
          time: '0900',
        },
        {
          occupied: null,
          time: '0915',
        },
        {
          occupied: null,
          time: '0930',
        },
        {
          occupied: null,
          time: '0945',
        },
        {
          occupied: null,
          time: '1000',
        },
        {
          occupied: null,
          time: '1015',
        },
        {
          occupied: null,
          time: '1030',
        },
        {
          occupied: null,
          time: '1045',
        },
        {
          occupied: null,
          time: '1100',
        },
        {
          occupied: null,
          time: '1115',
        },
        {
          occupied: null,
          time: '1130',
        },
        {
          occupied: null,
          time: '1145',
        },
        {
          occupied: null,
          time: '1200',
        },
        {
          occupied: null,
          time: '1215',
        },
        {
          occupied: null,
          time: '1230',
        },
        {
          occupied: null,
          time: '1245',
        },
      ],
      days: [],
      week_no: null,
      week_diff: null,
      curr_week_no: 0,
    }
  },
  created() {
    this.week_no = moment().week()
    // eslint-disable-next-line
    console.log("curr Week no " + this.week_no)
    this.week_diff = 0
    this.days = this.get_days_of_week()
  },
  methods: {
    get_days_of_week() {
      var startOfWeek = moment()
        .add(this.week_diff, 'weeks')
        .startOf('isoWeek')
      var endOfWeek = moment()
        .add(this.week_diff, 'weeks')
        .endOf('isoWeek')

      var days = []
      var day = startOfWeek

      while (day <= endOfWeek) {
        let day_obj = {}
        day_obj.day = day.format('ddd')
        day_obj.date = day.format('DD')
        day_obj.month = day.format('MM')
        // day_obj.push(day.toDate())
        days.push(day_obj)
        day = day.clone().add(1, 'd')
      }
      // eslint-disable-next-line
      console.log(days)
      return days
    },
    next_week() {
      this.week_diff = this.week_diff + 1
      this.days = this.get_days_of_week()
    },
    prev_week() {
      this.week_diff = this.week_diff - 1
      this.days = this.get_days_of_week()
    },
  },
}
</script>

<style lang="scss">
.num_guests {
  display: block;
  text-align: center;
  .btn {
    padding: 1.175rem 1.75rem;
  }
}
.select_date {
  display: flex;
  justify-content: center;
  width: 100%;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    > span:first-child {
      font-size: 10px;
    }
  }
  .arrow {
    justify-content: center;
    cursor: pointer;
  }
}
.time_slot_block {
  height: 320px;
  overflow-y: scroll;
  .time_slot {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 5px 0;
    border: 1px solid #ccc;
    height: 80px;
    .active {
      background: rgba(189, 189, 189, 0.6);
    }
    .is_available {
      color: green;
      font-weight: 900;
      font-size: 30px;
      line-height: 19px;
      &.not_available {
        color: red;
      }
    }
  }
}
.badge-secondary {
  padding: 10px;
  border-radius: 10%;
  margin-right: 10px;
  &.active {
    background-color: #62bb31;
  }
}
</style>
