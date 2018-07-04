<template>
  <div class="home">
    <Home :status="'home'"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Home from '@/components/mainComponents/Home.vue'

export default {
  name: 'home',
  components: {
    Home
  }
}
</script>
