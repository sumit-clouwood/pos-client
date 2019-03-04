<template>
  <div class="amount-keypad">
    <div class="payment-key">7</div>
    <div class="payment-key">8</div>
    <div class="payment-key">9</div>
    <div class="payment-key">10</div>
    <div class="payment-key">4</div>
    <div class="payment-key">5</div>
    <div class="payment-key">6</div>
    <div class="payment-key">20</div>
    <div class="payment-key">1</div>
    <div class="payment-key">2</div>
    <div class="payment-key">3</div>
    <div class="backspace" id="backspace">
      <img src="img/pos/close-icon.png" alt="close" />
    </div>
    <div id="clearcalc" class="">c</div>
    <div class="payment-key">0</div>
    <div class="payment-key">.</div>
    <div id="add-amt">Add</div>
  </div>
</template>

<script>
export default {
  name: 'AmountCalculator',
}
</script>
