<template>
  <div class="main-oreders-date">
    {{ transDate(DateToday) }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DateTimeVue',
  methods: {
    transDate(date) {
      let transDate = ''
      date.split(' ').forEach(element => {
        transDate += ' ' + this._t(element.replace(',', ''))
      })
      return transDate
    },
  },
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>

<style scoped></style>
