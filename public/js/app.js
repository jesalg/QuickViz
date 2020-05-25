import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'

Vue.use(VueResource);

new Vue({
  el: '#app',
  data: {
    quickvizmd: '',
    chart: ''
  },
  render (createElement) {
    return createElement(App)
  },
  beforeMount() {
    this.quickvizmd = this.$el.dataset.quickvizmd;
    this.chart = this.$el.dataset.chart;
  }
})