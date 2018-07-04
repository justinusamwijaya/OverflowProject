import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import store from './store'
import navbar from './components/static/navbar'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/main.css'
import './assets/style.scss'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

Vue.component('navbar', navbar)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
