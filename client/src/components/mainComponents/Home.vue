<template>
  <div>
    <loginHome v-if="!$store.state.loggedIn"/>
    <homePage v-else :status="status" />
  </div>
</template>

<script>
import loginHome from './loginHome.vue'
import homePage from './homePage.vue'
export default {
  name: 'HomePage',
  components: { loginHome, homePage },
  data () {
    return {
    }
  },
  created () {
    console.log(this.status)
  },
  methods: {
  },
  props: ['status']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.mainContainer{
  margin-top: 6rem;
}

</style>
