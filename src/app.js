import Vue from 'vue'
import App from './App.vue'
import './../node_modules/face-api.js/dist/face-api'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import store from './store'

Vue.use(Vuetify)

new Vue({
  el: '#app',
  render: h => h(App),
  store
})