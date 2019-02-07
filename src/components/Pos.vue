<template>
  <div class="pos">
    <div class="title">
      <h1>{{ msg }} </h1>
      <h1>{{ $t('title') }} from translation</h1>
      <h1>{{ $t('body') }} from translation</h1>
      <Toolbar msg="Broccoli POS Header Toolbar"/>
      <Content msg="Broccoli POS Content"/>
    </div>
    <div class="catgories">
      <h3>Categories</h3>
      <ul>
        <li
          v-for="category in categories"
          :key="category.id">
          <span @click="browseCategory(category)">
            {{ category.title }} 
          </span>
        </li>
      </ul>  
      
    </div>
    <section v-if="errored">
      <h2 class="error">Error Messages</h2>
      <p>{{ errored }}</p>
    </section>
  </div>
</template>

<script>
import Toolbar from './pos/Toolbar.vue'
import Content from './pos/Content.vue'
import { mapState } from 'vuex'

export default {
  name: 'Pos',
  components : {
    Toolbar,
    Content
  },
  //store private data in component using data
  data: function () {
    return {
      info : null,
      loading: true, //async loading indicator
      errored: false //either request had error
    }
  },
  
  //data passed to this component by its parent is contained inside props
  props: {
    msg: String
  },

  computed: mapState({
    // map this.categories to store.state.categories, it uses dispatch
    categories: state => state.category.fetchAll
  }),

  methods : {
    browseCategory(category) {
      this.$store.dispatch('category/browse', category);
    }
  },

  
  beforeCreate () {
    this.$store.dispatch('auth/auth')
      .then(response => 
        this.$store.dispatch('category/fetchAll')
      )
  },

  mounted () {
     
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
