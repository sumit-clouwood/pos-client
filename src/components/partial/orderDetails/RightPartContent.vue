<template>
  <div>
    <Receipt />
    <History />
    <Modification />
    <Payment />
  </div>
</template>

<script>
import Receipt from './rightContent/Receipt'
import History from './rightContent/History'
import Modification from './rightContent/Modification'
import Payment from './rightContent/Payment'
export default {
  name: 'RightPartContent',
  components: {
    Receipt,
    History,
    Modification,
    Payment,
  },
}
</script>

<style scoped></style>
