<template>
  <div class="customer-insight-feedback">
    <p>{{ _t('User Feedback:') }}</p>
    <ul class="ullist-feedback">
      <li>
        <a href="#"
          ><span class="black-smile"><img src="/img/pos/unhappy.png"/></span
          ><span class="color-smile"
            ><img src="/img/pos/unhappy-color.png"/></span
        ></a>
      </li>
      <li>
        <a href="#">
          <span class="black-smile">
            <img src="/img/pos/unhappy-copy.png" /> </span
          ><span class="color-smile"
            ><img src="/img/pos/unhappy-copy-color.png"/></span
        ></a>
      </li>
      <li>
        <a href="#"
          ><span class="black-smile"><img src="/img/pos/confused.png"/></span
          ><span class="color-smile"
            ><img src="/img/pos/confused-color.png"/></span
        ></a>
      </li>
      <li class="active">
        <a href="#"
          ><span class="black-smile"
            ><img src="/img/pos/unhappy-copy-2.png"/></span
          ><span class="color-smile"
            ><img src="/img/pos/unhappy-copy-2-color.png"/></span
        ></a>
      </li>
      <li>
        <a href="#"
          ><span class="black-smile"><img src="/img/pos/happy.png"/></span
          ><span class="color-smile"><img src="/img/pos/happy-color.png"/></span
        ></a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CustomerFeedback',
  computed: {
    ...mapGetters('location', ['_t']),
  },
}
</script>
