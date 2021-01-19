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
          <div class="add-note-area">
            <select
              autocomplete="off"
              class="inputSearch dropdown"
              v-model="measurementUnit"
            >
              <option
                v-for="measurement in measurement_units.data"
                :value="measurement.unit_code || measurement.unit"
                :key="measurement._id"
              >
                {{ measurement.name }}
              </option>
            </select>
          </div>

          <div class="add-note-area">
            <input
              autocomplete="off"
              type="number"
              :placeholder="_t('0.00')"
              class="inputSearch"
              v-model="measurementValue"
            />
          </div>
          <span
            v-if="error"
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
                @click="addToCart"
              >
                {{ _t('Add to Cart') }}
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
/* global  hideModal  */
/* eslint-disable no-console */
import { mapGetters } from 'vuex'
import Cart from '@/mixins/Cart'
export default {
  name: 'ScalePopup',
  data() {
    return {
      error: false,
    }
  },
  computed: {
    ...mapGetters('location', ['_t']),
    ...mapGetters('category', [
      'current_item',
      'find_measurement_unit',
      'find_measurement_unit_byname',
      'measurement_units',
      'measurement_unit_name',
      'item_measurement_unit',
      'item_measurement_value',
    ]),

    measurementValue: {
      get() {
        return this.item_measurement_value
      },
      set(value) {
        this.$store.commit('category/setItemMeasurementValue', value)
      },
    },
    measurementUnit: {
      get() {
        return this.item_measurement_unit
      },
      set(value) {
        this.$store.commit('category/setItemMeasurementUnit', value)
      },
    },
  },
  methods: {
    findItemMeasurementUnit(
      itemMeasurementUnit,
      scaleMeasurementUnit,
      measurementUnits
    ) {
      const measurement = this.find_measurement_unit(itemMeasurementUnit)
      if (measurement.unit_code == scaleMeasurementUnit) {
        return scaleMeasurementUnit
      }
      console.log(
        measurement.unit_code,
        scaleMeasurementUnit,
        measurementUnits.data
      )
      //get all base units
      const noSubUnit = measurementUnits.data.find(unit => !unit.sub_unit)
      const base_units = measurementUnits.data.filter(
        unit => unit.sub_unit == noSubUnit._id
      )
      console.log('base units', base_units)

      let associative_units = {}
      base_units.forEach(baseunit => {
        associative_units = this.recurrsiveUnits(
          baseunit,
          measurementUnits.data
        )
      })
      console.log(associative_units)
      //now search in associative units
    },
    recurrsiveUnits(baseUnit, units, output = {}) {
      //miligram, units, {}
      //gram, units, {miligram}
      //kg, units, {miligram: grams: kg}

      output[baseUnit.unit_code] = {}

      let parentUnit = units.find(unit => unit.sub_unit == baseUnit._id)
      if (parentUnit) {
        output[baseUnit.unit_code][parentUnit.unit_code] = {}
        return this.recurrsiveUnits(parentUnit, units, output)
      }
      return output
    },
    addToCart() {
      this.error = ''
      if (!this.measurementValue) {
        this.error = 'Please enter measurement value'
        return false
      }

      const measurement = this.find_measurement_unit_byname(
        this.measurementUnit
      )
      if (!measurement) {
        this.error = `Sorry measurement unit ${this.measurementUnit} not supported`
        return false
      }
      let currentMeasurementValue = this.measurementValue
      let item = { ...this.current_item }
      if (measurement._id !== item.measurement_unit) {
        //convert here, we receive 'STARUnitKG' from scale but we have 'STARUnitG' as product unit
        if (measurement.unit_code == 'STARUnitKG') {
          //convert measurement value (kg) to grams
          //multiply with 1000
          currentMeasurementValue *= 1000
        } else if (measurement.unit_code == 'STARUnitG') {
          //convert measurement value (g) to kilograms
          //divide by 1000
          currentMeasurementValue /= 1000
        } else {
          const itemMeasurementUnit = this.find_measurement_unit(
            item.measurement_unit
          )
          this.error = `Sorry, this item expects measurement in ${itemMeasurementUnit.unit}`
          return false
        }
      }

      item.measurement_value = currentMeasurementValue

      hideModal('#scale-popup')
      this.measurementValue = ''
      return this.itemsAddToCart(item)
    },
  },
  mixins: [Cart],
  watch: {
    current_item(val) {
      if (val) {
        const measurement = this.find_measurement_unit(
          this.current_item.measurement_unit
        )
        if (measurement) {
          this.$store.commit(
            'category/setItemMeasurementUnit',
            measurement.unit_code
          )
        }
      }
    },
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
  width: 100%;
  border: 2px solid #efefef;
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
