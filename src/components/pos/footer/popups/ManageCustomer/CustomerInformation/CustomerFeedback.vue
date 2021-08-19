<template>
  <div class="customer-insight-feedback">
    <p class="color-text-invert">{{ _t('User') + ' ' + _t('Feedback') }}:</p>
    <ul class="ullist-feedback">
      <li>
        <a role="button"
          ><span class="black-smile"
            ><img
              src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/unhappy.png"/></span
          ><span class="color-smile"
            ><img
              src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/unhappy-color.png"/></span
        ></a>
      </li>
      <li>
        <a role="button">
          <span class="black-smile">
            <img
              src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/unhappy-copy.png"
            /> </span
          ><span class="color-smile"
            ><img
              src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/unhappy-copy-color.png"/></span
        ></a>
      </li>
      <li>
        <a role="button"
          ><span class="black-smile"
            ><img
              src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/confused.png"/></span
          ><span class="color-smile"
            ><img
              src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/confused-color.png"/></span
        ></a>
      </li>
      <li class="active">
        <a role="button"
          ><span class="black-smile"
            ><img
              src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/unhappy-copy-2.png"/></span
          ><span class="color-smile"
            ><img
              src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/unhappy-copy-2-color.png"/></span
        ></a>
      </li>
      <li>
        <a role="button"
          ><span class="black-smile"
            ><img
              src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/happy.png"/></span
          ><span class="color-smile"
            ><img
              src="https://d3jjfdwi6rnqlf.cloudfront.net/img/pos/happy-color.png"/></span
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
